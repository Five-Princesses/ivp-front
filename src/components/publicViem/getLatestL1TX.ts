import pLimit from 'p-limit';
import axios from 'axios';
import { mainnetPublicClient } from './publicClient';

// Multiple Etherscan API keys
const ETHERSCAN_API_KEY: string[] = [
  '16Q6QYI56HV1PSUG888ICGMCT8UNIV8HBI',
  '1TWHEEQDRAP3PY6BX3ZH3AFQTSM3PFRWWN',
  'TWRIWAEQTDADR8AVYSSFZKSS1RPRT2SAP6',
];

// Limit the number of concurrent API calls
const limit = pLimit(5); // 동시성 5로 제한

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms); // resolve만 호출, return 사용 안 함
  });
}

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2
): Promise<T> {
  return fn().catch(async error => {
    if (retries <= 0) {
      throw error;
    }
    console.warn(`Retrying... ${retries} attempts left`);
    return fetchWithRetry(fn, retries - 1); // 재귀 호출로 재시도
  });
}

// Common function to fetch the latest transaction hash
async function fetchLatestL1TransactionHash(
  address: string,
  apiKey: string
): Promise<string | null> {
  return fetchWithRetry(async () => {
    const latestBlockNumber: bigint =
      await mainnetPublicClient.getBlockNumber();
    const startBlockNumber = 0;

    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== '1') {
      if (response.data.message === 'No transactions found') {
        console.log(`No transactions found for address: ${address}`);
        return 'No Transaction';
      }
      throw new Error(`Etherscan API Error: ${response.data.message}`);
    }

    const transactions = response.data.result;
    return transactions.length > 0 ? transactions[0].hash : 'No Transaction';
  });
}

// Optimized function to fetch transactions for multiple addresses
export default async function getLatestL1Transactions(
  addresses: string[]
): Promise<(string | null)[]> {
  // limit을 사용해 비동기 함수 배열을 생성
  const apiFunctions = addresses.map((address, index) => {
    const apiKey = ETHERSCAN_API_KEY[index % ETHERSCAN_API_KEY.length];

    // limit을 사용하여 병렬로 처리할 비동기 작업 생성 (await 제거)
    return limit(() => {
      return delay(500).then(() =>
        fetchLatestL1TransactionHash(address, apiKey)
      );
    });
  });

  // 모든 비동기 작업을 병렬로 처리
  const results = await Promise.all(apiFunctions);

  return results;
}
