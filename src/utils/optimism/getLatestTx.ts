import pLimit from 'p-limit';
import axios from 'axios';
import { apiUrls } from '../../constants/common/url';
import chainTypes from '../../constants/common/chainTypes';
import { mainnetPublicClient } from '../common/publicClient';

const ETHERSCAN_API_KEY: string[] = [
  import.meta.env.VITE_ETHERSCAN_API_KEY1,
  import.meta.env.VITE_ETHERSCAN_API_KEY2,
  import.meta.env.VITE_ETHERSCAN_API_KEY3,
];

// Multiple Optimism API keys : Not Yet... Do Not Use!!
const OPTIMISM_API_KEYS: string[] = [
  import.meta.env.VITE_ARBISCAN_API_KEYS1,
  import.meta.env.VITE_ARBISCAN_API_KEYS2,
  import.meta.env.VITE_ARBISCAN_API_KEYS3,
  import.meta.env.VITE_ARBISCAN_API_KEYS4,
  import.meta.env.VITE_ARBISCAN_API_KEYS5,
];

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

async function fetchLatestTransactionHash(
  address: string,
  apiKey: string,
  flag: number
): Promise<string | null> {
  return fetchWithRetry(async () => {
    const startBlockNumber: bigint = 0n; // 항상 0이면?
    const latestBlockNumber: bigint =
      await mainnetPublicClient.getBlockNumber();

    let url = '';
    if (flag === chainTypes.ETHEREUM) {
      url = apiUrls.getEtherTxUrl(
        address,
        startBlockNumber,
        latestBlockNumber,
        apiKey
      );
    } else if (flag === chainTypes.ARBITRUM) {
      url = apiUrls.getArbiTxUrl(
        address,
        startBlockNumber,
        latestBlockNumber,
        apiKey
      );
    }

    const response = await axios.get(url);

    if (response.data.status !== '1') {
      if (response.data.message === 'No transactions found') {
        console.log(`No transactions found for address: ${address}`);
        return null;
      }
      throw new Error(`Etherscan API Error: ${response.data.message}`);
    }

    const transactions = response.data.result;
    return transactions.length > 0 ? transactions[0].hash : null;
  });
}

export default async function getLatestTransactions(
  addresses: string[],
  flag: number
): Promise<string[]> {
  // limit을 사용해 비동기 함수 배열을 생성
  const apiFunctions = addresses.map((address, index) => {
    let apiKey = '';
    switch (flag) {
      case chainTypes.ETHEREUM:
        apiKey = ETHERSCAN_API_KEY[index % ETHERSCAN_API_KEY.length];
        break;
      case chainTypes.ARBITRUM:
        apiKey = OPTIMISM_API_KEYS[index % OPTIMISM_API_KEYS.length];
        break;
      default:
        break;
    }

    // limit을 사용하여 병렬로 처리할 비동기 작업 생성 (await 제거)
    return limit(() => {
      return delay(500).then(() =>
        fetchLatestTransactionHash(address, apiKey, flag)
      );
    });
  });

  // 모든 비동기 작업을 병렬로 처리
  const results = await Promise.all(apiFunctions);

  return results.map(hash => hash || 'No Transaction');
}
