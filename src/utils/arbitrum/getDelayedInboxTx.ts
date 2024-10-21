import axios from 'axios';
import pLimit from 'p-limit';
import { hexToBigInt, toHex, fromHex, decodeFunctionData } from 'viem';

import {
  mainnetPublicClient,
  arbitrumPublicClient,
} from '../common/publicClient';

import {
  L1_ARBITRUM_DELAYED_INBOX_CONTRACT_ADDRESS,
  L1_TO_L2_ALIAS_ADDRESS,
} from '../../constants/arbitrum/address';

import { apiUrls } from '../../constants/common/url';
import {
  createRetryableTicket,
  submitRetryable,
} from '../../constants/arbitrum/abi';
import {
  createRetryableTicketSignature,
  submitRetryableSignature,
} from '../../constants/arbitrum/functionSignature';

interface IL1Tx {
  transactionHash: `0x${string}`;
  from: `0x${string}`;
  input: `0x${string}`;
  value: bigint;
  aliasedL2Addr: `0x${string}`;
  timestamp: bigint;
  blockNumber: bigint;
  requestId: string;
  functionName: string | null;
  estL2Calldata: string | null;
}

export interface IL1toL2PairTx {
  l1TxHash: `0x${string}`;
  l1From: `0x${string}`;
  l1Input: `0x${string}`;
  l1Value: bigint;
  l1Timestamp: bigint;
  l1BlockNumber: bigint;
  estL2Calldata: string | null;

  l2TxHash: `0x${string}` | null;
  l2From: `0x${string}` | null;
  l2Input: `0x${string}` | null;
  l2Value: bigint | null;
  l2BlockNumber: bigint | null;
  l2To: `0x${string}` | null;
  l2FunctionName: string | null;
  l2CRTCalldata: string | null;

  requestId: string; // ticketNumber
}

function trimTo20HexCharacters(hex: string): `0x${string}` {
  return `0x${hex.slice(4)}`;
}

async function fetchDelayedInboxTxList(): Promise<IL1Tx[]> {
  const currentBlock =
    (await mainnetPublicClient.getBlockNumber()) - BigInt(1000);

  const logs = await mainnetPublicClient.getLogs({
    address: L1_ARBITRUM_DELAYED_INBOX_CONTRACT_ADDRESS,
    toBlock: 'latest',
    fromBlock: currentBlock,
  });

  const results = await Promise.all(
    logs.reverse().map(async log => {
      const tx = await mainnetPublicClient.getTransaction({
        hash: log.transactionHash,
      });

      if (tx.to === L1_ARBITRUM_DELAYED_INBOX_CONTRACT_ADDRESS.toLowerCase()) {
        const aliasedAddr = trimTo20HexCharacters(
          toHex(hexToBigInt(L1_TO_L2_ALIAS_ADDRESS) + hexToBigInt(tx.from), {
            size: 21,
          })
        );

        const block = await mainnetPublicClient.getBlock({
          blockNumber: log.blockNumber,
        });

        const txData: IL1Tx = {
          transactionHash: log.transactionHash,
          from: tx.from,
          input: tx.input,
          value: tx.value,
          aliasedL2Addr: aliasedAddr,
          timestamp: block.timestamp,
          blockNumber: block.number,
          requestId: String(log.topics[1]),
          functionName: null,
          estL2Calldata: null,
        };

        try {
          if (txData.input.slice(0, 10) === createRetryableTicketSignature) {
            const { functionName, args } = decodeFunctionData({
              abi: createRetryableTicket,
              data: txData.input,
            });

            txData.functionName = functionName;
            txData.estL2Calldata = String(args?.[7]);
          }
        } catch (error) {
          console.error('Error encoding data : ', error);
        }

        return txData;
      }

      return null;
    })
  );

  const filteredResults = results
    .filter(result => result !== null)
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 10);

  return filteredResults;
}

async function fetchL1toL2PairTxInfo() {
  const l1TxList: IL1Tx[] = await fetchDelayedInboxTxList();
  const currentBlock = await arbitrumPublicClient.getBlockNumber();
  const fromBlock = currentBlock - BigInt(1000000);

  const limit = pLimit(5);
  const delay = (ms: number): Promise<void> =>
    new Promise<void>(resolve => {
      setTimeout(resolve, ms);
    });

  const l2TxListByAddress = await Promise.all(
    l1TxList.map(l1Tx =>
      limit(async () => {
        await delay(1000); // 1초 지연
        const apiUrl = apiUrls.getArbiscanAddressTxUrl(
          l1Tx.aliasedL2Addr,
          fromBlock,
          currentBlock,
          import.meta.env.VITE_ARBISCAN_API_KEYS1
        );

        try {
          const response = await axios.get(apiUrl);
          return response.data.result;
        } catch (error) {
          console.error('Error fetching transaction by hash:', error);
          return null;
        }
      })
    )
  );

  const sortedPromises = l2TxListByAddress
    .flat()
    .sort((a, b) => Number(b.blockNumber - a.blockNumber));

  const l2TxListByHash = await Promise.all(
    sortedPromises.map(l2Tx =>
      limit(async () => {
        await delay(1000);
        const apiUrl = apiUrls.getArbiscanTxByHash(
          l2Tx.hash,
          import.meta.env.VITE_ARBISCAN_API_KEYS1
        );
        try {
          const response = await axios.get(apiUrl);
          return response.data.result;
        } catch (error) {
          console.error('Error fetching transaction by hash:', error);
          return null;
        }
      })
    )
  );

  const filteredL2TxListByHash = l2TxListByHash.filter(tx => tx !== null);

  const pairTxList: IL1toL2PairTx[] = [];

  l1TxList.forEach(l1Tx => {
    const matchingItem = filteredL2TxListByHash.find(
      l2Tx => l2Tx.requestId === l1Tx.requestId
    );

    const pairTx: IL1toL2PairTx = {
      l1TxHash: l1Tx.transactionHash,
      l1From: l1Tx.from,
      l1Input: l1Tx.input,
      l1Value: l1Tx.value,
      l1Timestamp: l1Tx.timestamp,
      l1BlockNumber: l1Tx.blockNumber,
      estL2Calldata: l1Tx.estL2Calldata,

      l2TxHash: null,
      l2From: null,
      l2Input: null,
      l2Value: null,
      l2BlockNumber: null,
      l2FunctionName: null,
      l2To: null,
      l2CRTCalldata: null,

      requestId: l1Tx.requestId,
    };

    if (matchingItem) {
      try {
        if (matchingItem.input.slice(0, 10) === submitRetryableSignature) {
          const { functionName, args } = decodeFunctionData({
            abi: submitRetryable,
            data: matchingItem.input,
          });

          pairTx.l2FunctionName = functionName;
          pairTx.l2CRTCalldata = String(args?.[10]);
        }
      } catch (error) {
        console.error('Error encoding data : ', error);
      }

      pairTx.l2TxHash = matchingItem.hash;
      pairTx.l2From = matchingItem.from;
      pairTx.l2Input = matchingItem.input;
      pairTx.l2Value = matchingItem.value
        ? fromHex(matchingItem.value, 'bigint')
        : BigInt(0);

      pairTx.l2Value = matchingItem.depositValue
        ? fromHex(matchingItem.depositValue, 'bigint')
        : pairTx.l2Value;
      pairTx.l2BlockNumber = BigInt(matchingItem.blockNumber);
      pairTx.l2To = matchingItem.to;
    }
    pairTxList.push(pairTx);
    return pairTx;
  });

  return pairTxList;
}

export async function getL1toL2PairTxInfo() {
  return fetchL1toL2PairTxInfo();
}

export default getL1toL2PairTxInfo;
