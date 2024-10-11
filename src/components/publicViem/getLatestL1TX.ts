/*
import axios from 'axios';
import { mainnetPublicClient } from './publicClient';

// 여러 개의 Arbiscan API 키를 배열로 관리
const ETHERSCAN_API_KEY: string[] = [
  '16Q6QYI56HV1PSUG888ICGMCT8UNIV8HBI',
  '1TWHEEQDRAP3PY6BX3ZH3AFQTSM3PFRWWN',
  'TWRIWAEQTDADR8AVYSSFZKSS1RPRT2SAP6',
];

// 최신 트랜잭션 해시를 가져오는 공통 함수
async function fetchLatestL2TransactionHash(
  address: string,
  apiKey: string
): Promise<string | null> {
  try {
    // 최신 블록 번호 가져오기
    const latestBlockNumber: bigint =
      await mainnetPublicClient.getBlockNumber();

    // 5분 전 블록 계산 (블록은 약 12초마다 생성, 5분은 약 25 블록 전)
    const startBlockNumber = 0;

    // Arbiscan API 요청 URL 생성
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${apiKey}`;

    // Arbiscan API로 GET 요청
    const response = await axios.get(url);

    // 응답에서 상태 확인
    if (response.data.status !== '1') {
      console.error(`Etherscan API Error: ${response.data.message}`);
      return null;
    }
    const transactions = response.data.result;

    // 응답에서 트랜잭션이 있는지 확인 후 가장 최근 트랜잭션 해시 반환
    if (transactions && transactions.length > 0) {
      return transactions[0].hash; // 가장 최근 트랜잭션 해시 반환
    }
    return null; // 트랜잭션이 없으면 null 반환
  } catch (error) {
    console.error('Error fetching transaction history from Arbiscan:', error);
    return null;
  }
}

// 각 API 키에 대해 별도의 함수 정의
export async function getLatestL1TransactionHash1(
  address: string
): Promise<string | null> {
  return fetchLatestL2TransactionHash(address, ETHERSCAN_API_KEY[0]);
}

export async function getLatestL1TransactionHash2(
  address: string
): Promise<string | null> {
  return fetchLatestL2TransactionHash(address, ETHERSCAN_API_KEY[1]);
}

export async function getLatestL1TransactionHash3(
  address: string
): Promise<string | null> {
  return fetchLatestL2TransactionHash(address, ETHERSCAN_API_KEY[2]);
}
*/
