import axios from 'axios';
import { mainnetPublicClient } from './publicClient';

// Etherscan API 키 (Etherscan에서 발급받은 API 키 입력)
const ETHERSCAN_API_KEY = 'Z2SICEXNDNT3WRK7A6QX44TTHX4ASHY9HB';

// L1_BATCH_SUBMITTER의 가장 최근 트랜잭션 해시를 Etherscan API로 가져오는 함수
export default async function getLatestTransactionHash(address: string) {
  try {
    // 최신 블록 번호 가져오기
    const latestBlockNumber = await mainnetPublicClient.getBlockNumber();

    // 5분 전 블록 계산 (블록은 약 12초마다 생성, 5분은 약 25 블록 전)
    const startBlockNumber = 0;

    // Etherscan API 요청 URL 생성
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlockNumber}&endblock=${latestBlockNumber}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    // Etherscan API로 GET 요청
    const response = await axios.get(url);
    const transactions = response.data.result;

    // 응답에서 트랜잭션이 있는지 확인 후 가장 최근 트랜잭션 해시 반환
    if (transactions && transactions.length > 0) {
      return transactions[0].hash; // 가장 최근 트랜잭션 해시 반환
    }
    return null; // 트랜잭션이 없으면 null 반환
  } catch (error) {
    console.error('Error fetching transaction history from Etherscan:', error);
    return null;
  }
}
