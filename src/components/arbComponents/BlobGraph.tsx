import React, { useState, useEffect } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Link, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import BoxFrame from '../common/BoxFrame';
import ContentBox from '../common/ContentBox';
import {
  fetchBlobDataFromTransaction,
  getBatchSubmitterLatestTxHash,
} from './arbHook/BlobGraphHook'; // 함수 import 추가

// Chart.js 요소 등록
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function BlobGraph() {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 처음부터 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [blobGasUsed, setBlobGasUsed] = useState<number | null>(null);
  const [calldataGasUsed, setCalldataGasUsed] = useState<number | null>(null);

  // 트랜잭션 해시를 직접 가져와 데이터를 받아오는 함수
  const fetchTransactionData = async () => {
    setLoading(true); // 데이터 가져오는 동안 로딩 상태 표시
    try {
      // 가장 최근 트랜잭션 해시를 가져옴
      const txHash = await getBatchSubmitterLatestTxHash();
      if (!txHash) {
        setError('Failed to fetch transaction hash');
        return;
      }

      const blobData = await fetchBlobDataFromTransaction(txHash); // txHash를 사용해 데이터 가져옴
      if (blobData) {
        setBlobGasUsed(blobData.blobGasUsed);
        setCalldataGasUsed(blobData.blobAsCalldataGasUsed);
        setTransactionHash(blobData.transactionHash); // 트랜잭션 해시도 설정
        setError(null); // 오류 초기화
      } else {
        setBlobGasUsed(null);
        setCalldataGasUsed(null);
        setTransactionHash(txHash);
        setError('No transactions found.');
      }
    } catch (err) {
      setError('Failed to fetch transaction data');
      console.error('Error fetching transaction data:', err);
    } finally {
      setLoading(false); // 데이터 로드 완료 후 로딩 해제
    }
  };

  useEffect(() => {
    fetchTransactionData();

    const interval = setInterval(fetchTransactionData, 3 * 60 * 1000); // 3분마다 데이터 갱신

    return () => clearInterval(interval);
  }, []);

  const renderGraph = () => {
    const data = {
      labels: ['Gas Usage'],
      datasets: [
        {
          label: 'Blob Gas Used',
          data: [blobGasUsed],
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // 파란색
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Blob As Calldata Gas Used',
          data: [calldataGasUsed],
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // 빨간색
          hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
      ],
    };

    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label(context: any) {
              // Object shorthand used here
              return `${context.dataset.label}: ${context.raw.toLocaleString()} Gas`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderContent = () => {
    if (loading) {
      return <Typography>Loading...</Typography>;
    }

    if (error) {
      return (
        <>
          Latest Transaction Hash:
          <Link
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            {transactionHash}
          </Link>
          <Typography variant="h5" color="error" fontWeight="bold">
            Maybe Batch Submitter Used Calldata!!!
          </Typography>
        </>
      );
    }

    if (transactionHash) {
      return (
        <>
          Latest Transaction Hash:
          <Link
            href={`https://etherscan.io/tx/${transactionHash}#blobs`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
            {transactionHash}
          </Link>
          <Box mt={4}>{renderGraph()}</Box>
        </>
      );
    }

    return (
      <Typography variant="h5" color="error" fontWeight="bold">
        No Transaction Found.
      </Typography>
    );
  };

  return (
    <BoxFrame title="Blob Vs Calldata">
      <ContentBox content={renderContent()} />
    </BoxFrame>
  );
}