import axios from 'axios';
import getLatestTransactionHash from './getLatestTx';
import chainTypes from '../../constants/common/chainTypes';
import { L1_BATCH_SUBMITTER } from '../../constants/arbitrum/address';

// Define the structure of blob data and commitment data
interface BlobData {
  versionedHash: string;
  index: number;
}

interface CommitmentData {
  versionedHash: string;
  commitment: string;
}

// L1_BATCH_SUBMITTER의 가장 최근 트랜잭션 해시를 가져오는 함수
export async function getBatchSubmitterLatestTxHash() {
  return getLatestTransactionHash(L1_BATCH_SUBMITTER, chainTypes.ETHEREUM);
}

// versionedHash로부터 commitment 값을 가져오는 함수
export async function fetchBlobCommitment(versionedHash: string) {
  try {
    const response = await axios.get(
      `https://api.blobscan.com/blobs/${versionedHash}`
    );
    const { data } = response;

    if (!data) {
      console.error(
        'BlobScan API에서 commitment 데이터를 가져오는 데 실패했습니다.'
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      'BlobScan API에서 commitment 데이터를 가져오는 도중 오류 발생:',
      error
    );
    return null;
  }
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

    const { blobGasUsed, blobAsCalldataGasUsed, blobs } = data; // Blob 가스 사용량 및 blobs 추출

    // Use the correct type for `blobs` and ensure proper structure
    const commitments: CommitmentData[] = await Promise.all(
      blobs.map(async (blob: BlobData): Promise<CommitmentData> => {
        const { versionedHash } = blob;
        const commitmentData = await fetchBlobCommitment(versionedHash);
        return {
          versionedHash,
          commitment: commitmentData?.commitment || 'N/A',
        };
      })
    );

    return {
      blobGasUsed,
      blobAsCalldataGasUsed,
      transactionHash: txHash,
      commitments,
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
    if (!txHash) {
      console.error('트랜잭션 해시를 가져오는 데 실패했습니다.');
      return null;
    }

    // console.log('Latest Transaction Hash:', txHash);

    // BlobScan API를 사용하여 데이터 가져오기
    const blobData = await fetchBlobDataFromApi(txHash);
    if (blobData) {
      // console.log(`트랜잭션 해시: ${blobData.transactionHash}`);
      // console.log(`Blob Gas Used: ${blobData.blobGasUsed}`);
      // console.log(
      //   `Blob As Calldata Gas Used: ${blobData.blobAsCalldataGasUsed}`
      // );
      // console.log('Commitments:', blobData.commitments);
    }

    return blobData;
  } catch (error) {
    console.error('Error fetching blob data from API:', error);
    return null;
  }
}
