import axios from 'axios';
import { Address } from 'viem';
import { arbitrumPublicClient } from '../common/publicClient';
import { L2_CORE_CORE_GOVERNOR_ADDRESS } from '../../constants/arbitrum/address';
import { apiUrls } from '../../constants/common/url';
import { timelock, getMinDelay } from '../../constants/arbitrum/abi';

// 트랜잭션 타입 정의
interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
}

// 트랜잭션 해시와 타임스탬프를 담은 객체 타입 정의
interface TransactionWithTimestamp {
  hash: string;
  timeStamp: string;
}

export async function fetchTransactionsByBlockRange(
  address: string,
  startBlock: bigint,
  endBlock: bigint,
  apiKey: string,
  methodId: string
): Promise<TransactionWithTimestamp[]> {
  const url = apiUrls.getArbiTxUrl(address, startBlock, endBlock, apiKey);

  try {
    const response = await axios.get(url);
    const transactions: Transaction[] = response.data.result;

    if (response.data.status !== '1') {
      throw new Error(`API Error: ${response.data.message}`);
    }

    // methodId가 일치하는 트랜잭션만 필터링하여 해시와 타임스탬프 추출
    const matchingTransactions = transactions
      .filter((tx: Transaction) => tx.input.startsWith(methodId))
      .map((tx: Transaction) => ({
        hash: tx.hash,
        timeStamp: tx.timeStamp,
      }));

    return matchingTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function fetchTimelockMinDelay() {
  const timelockAddress = await arbitrumPublicClient.readContract({
    address: L2_CORE_CORE_GOVERNOR_ADDRESS,
    abi: timelock,
    functionName: 'timelock',
  });

  const delayMin = await arbitrumPublicClient.readContract({
    address: timelockAddress as Address,
    abi: getMinDelay,
    functionName: 'getMinDelay',
  });

  return Number(delayMin as bigint);
}

export default { fetchTransactionsByBlockRange, fetchTimelockMinDelay };
