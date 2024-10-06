import axios from 'axios';
import { getLatestTransactionHash } from '../../publicViem/getLatestTx'; // 외부에서 가져온 트랜잭션 해시 함수

// L1_BATCH_SUBMITTER 주소 for test
export const L1_BATCH_SUBMITTER = '0xC1b634853Cb333D3aD8663715b08f41A3Aec47cc';

// L1_BATCH_SUBMITTER의 가장 최근 트랜잭션 해시를 가져오는 함수
export async function getBatchSubmitterLatestTxHash() {
  return getLatestTransactionHash(L1_BATCH_SUBMITTER);
}

// BlobScan API를 통해 트랜잭션 데이터를 가져오는 함수
export async function fetchBlobDataFromApi(txHash: string) {
  try {
    // BlobScan API 호출
    const response = await axios.get(
      `https://api.blobscan.com/transactions/${txHash}`
    );
    const { data } = response;

    if (!data) {
      console.error('BlobScan API에서 데이터를 가져오는 데 실패했습니다.');
      return null;
    }

    // 필요한 값 추출
    const { blobGasUsed } = data; // Blob 가스 사용량
    const { blobAsCalldataGasUsed } = data; // Calldata로 변환 시 예상 가스 사용량

    console.log('Blob Gas Used:', blobGasUsed);
    console.log('Blob As Calldata Gas Used:', blobAsCalldataGasUsed);

    return {
      blobGasUsed,
      blobAsCalldataGasUsed,
      transactionHash: txHash,
    };
  } catch (error) {
    console.error(
      'BlobScan API에서 트랜잭션 데이터를 가져오는 도중 오류 발생:',
      error
    );
    return null;
  }
}

// 트랜잭션 해시로부터 Blob Gas Used와 Blob As Calldata Gas 데이터를 API로 가져오는 함수
export async function fetchBlobDataFromTransaction(txHash: string) {
  try {
    // L1_BATCH_SUBMITTER의 가장 최근 트랜잭션 해시를 가져옴
    if (!txHash) {
      console.error('트랜잭션 해시를 가져오는 데 실패했습니다.');
      return null;
    }

    console.log('Latest Transaction Hash:', txHash);

    // BlobScan API를 사용하여 데이터 가져오기
    const blobData = await fetchBlobDataFromApi(txHash);
    if (blobData) {
      console.log(`트랜잭션 해시: ${blobData.transactionHash}`);
      console.log(`Blob Gas Used: ${blobData.blobGasUsed}`);
      console.log(
        `Blob As Calldata Gas Used: ${blobData.blobAsCalldataGasUsed}`
      );
    }

    return blobData;
  } catch (error) {
    console.error('Error fetching blob data from API:', error);
    return null;
  }
}
