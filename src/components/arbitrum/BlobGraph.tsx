import React, { useState, useEffect } from 'react';
import {
  Link,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import BoxFrame from '../common/BoxFrame';
import ContentBox from '../common/ContentBox';
import {
  fetchBlobDataFromTransaction,
  getBatchSubmitterLatestTxHash,
  L1_BATCH_SUBMITTER,
} from '../../utils/arbitrum/getBlobGraph';
import SubtitleBox from '../common/SubtitleBox';
import { getBalanceOnL1 } from '../../utils/getSecurityCouncil';

// ETH 변환 함수
const formatBalance = (balance: bigint) => Number(balance) / 10 ** 18; // .toFixed(4);

// Chart.js 요소 등록
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

// versionedHash를 앞 8글자와 뒤 6글자로 축약하는 함수
const formatVersionedHash = (hash: string) =>
  `${hash.slice(0, 8)}...${hash.slice(-6)}`;

export default function BlobGraph() {
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blobGasUsed, setBlobGasUsed] = useState<number | null>(null);
  const [calldataGasUsed, setCalldataGasUsed] = useState<number | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [commitments, setCommitments] = useState<
    { versionedHash: string; commitment: string }[]
  >([]);

  // 이더리움 잔액을 가져오는 함수
  const fetchBalance = async () => {
    try {
      const balanceResult = await getBalanceOnL1({
        addr: L1_BATCH_SUBMITTER[0],
      });
      setBalance(balanceResult);
    } catch (e) {
      setBalance(null);
    }
  };

  // 트랜잭션 해시를 가져와 데이터를 받아오는 함수
  const fetchTransactionData = async () => {
    setLoading(true);
    try {
      const txHash = await getBatchSubmitterLatestTxHash();
      if (!txHash) {
        setError('Failed to fetch transaction hash');
        return;
      }

      const blobData = await fetchBlobDataFromTransaction(
        txHash.map(tx => tx.hash)[0]
      );
      if (blobData) {
        setBlobGasUsed(blobData.blobGasUsed);
        setCalldataGasUsed(blobData.blobAsCalldataGasUsed);
        setTransactionHash(blobData.transactionHash);
        setCommitments(blobData.commitments || []);
        setError(null);
      } else {
        setBlobGasUsed(null);
        setCalldataGasUsed(null);
        setTransactionHash(txHash.map(tx => tx.hash)[0]);
        setError('No transactions found.');
      }
    } catch (err) {
      setError('Failed to fetch transaction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
    fetchBalance();

    const interval = setInterval(fetchTransactionData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderGraph = () => {
    const data = {
      labels: ['Gas Usage'],
      datasets: [
        {
          label: 'Blob Gas Used',
          data: [blobGasUsed],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'Blob As Calldata Gas Used',
          data: [calldataGasUsed],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
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

  // Commitments 테이블 렌더링
  const renderCommitmentsTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: '1px solid black' }}>
              Blob Versioned Hash
            </TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Commitment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commitments.map(({ versionedHash, commitment }) => (
            <TableRow key={versionedHash}>
              <TableCell sx={{ border: '1px solid black' }}>
                <Link
                  href={`https://api.blobscan.com/blobs/${versionedHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatVersionedHash(versionedHash)}
                </Link>
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {commitment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
          <Box mt={4}>{renderCommitmentsTable()}</Box>{' '}
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
      <SubtitleBox subtitle="Batch Submitter">
        <ContentBox
          content={
            <>
              <Typography variant="body1">
                Address:{' '}
                <Link
                  href={`https://etherscan.io/address/${L1_BATCH_SUBMITTER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {L1_BATCH_SUBMITTER}
                </Link>
              </Typography>
              <Typography variant="body1" mt={1}>
                Balance:{' '}
                {balance !== null
                  ? `${formatBalance(balance)} ETH`
                  : 'Loading...'}
              </Typography>
            </>
          }
        />
      </SubtitleBox>
      <SubtitleBox subtitle="Summary">
        <ContentBox content="The batch submitter is used to post L2 transactions to L1 in batches. Arbitrum One generally uses blobs to save on gas costs, but if using blob data increases gas expenses, it automatically converts to calldata." />
      </SubtitleBox>
      <ContentBox content={renderContent()} />
    </BoxFrame>
  );
}
