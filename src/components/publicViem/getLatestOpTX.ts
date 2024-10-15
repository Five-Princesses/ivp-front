import pLimit from 'p-limit';
import axios from 'axios';
import { arbitrumPublicClient } from './publicClient';

// Multiple OPMAINNET API keys
const OPMAINNET_API_KEYS: string[] = [
  'RB1AX2NQVJGG494C4KIZAWPIZTR3AHGWYY',
  'PKNEMK9QH58YQ97WKURSMUV4EUU7EZND1S',
  '8KSWNCHMP3NRPFVNQJMXEDQPFUIB8QEARX',
];

// Limit the number of concurrent API calls
const limit = pLimit(5); // 동시성 5로 제한

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms); // resolve만 호출, return 사용 안 함
  });
}

// 재귀적 재시도 로직 추가
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
async function fetchLatestL2TransactionHash(
  address: string,
  apiKey: string
): Promise<string | null> {
  return fetchWithRetry(async () => {
    const latestBlockNumber: bigint =
      await arbitrumPublicClient.getBlockNumber();
    const startBlockNumber = 0;

    const url = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== '1') {
      if (response.data.message === 'No transactions found') {
        console.log(`No transactions found for address: ${address}`);
        return null;
      }
      throw new Error(`OPMAINNET API Error: ${response.data.message}`);
    }

    const transactions = response.data.result;
    return transactions.length > 0 ? transactions[0].hash : null;
  });
}

// Optimized function to fetch transactions for multiple addresses
export default async function getLatestL2Transactions(
  addresses: string[]
): Promise<(string | null)[]> {
  // limit을 사용해 비동기 함수 배열을 생성
  const apiFunctions = addresses.map((address, index) => {
    const apiKey = OPMAINNET_API_KEYS[index % OPMAINNET_API_KEYS.length];

    // limit을 사용하여 병렬로 처리할 비동기 작업 생성 (await 제거)
    return limit(() => {
      return delay(500).then(() =>
        fetchLatestL2TransactionHash(address, apiKey)
      );
    });
  });

  // 모든 비동기 작업을 병렬로 처리
  const results = await Promise.all(apiFunctions);

  return results;
}
