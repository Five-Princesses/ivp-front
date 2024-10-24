import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Link,
  CircularProgress,
} from '@mui/material';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import {
  fetchTransactionsByBlockRange,
  fetchTimelockMinDelay,
} from '../../utils/arbitrum/getScheduleTx';
import {
  getProposals,
  getProposalTitle,
  Proposal,
} from '../../utils/arbitrum/getProposal';
import { METHOD_ID_TO_CHECK } from '../../constants/arbitrum/functionSignature';
import { L2_CORE_CORE_GOVERNOR_ADDRESS } from '../../constants/arbitrum/address';
import { API_URLS } from '../../constants/common/url';
import { DAO_CONTENTS } from '../../constants/arbitrum/contents';

// 트랜잭션 타입 정의
interface TransactionWithTimestamp {
  hash: string;
  timeStamp: string;
}

// 원하는 블록 범위 설정
const blockRanges = [
  [0, 99999999],
  [243167568, 243167568],
  [220085905, 220085905],
  // 필요한 만큼 범위를 추가
];

// 트랜잭션 해시를 축약하는 함수
const formatTransactionHash = (txHash: string | null) =>
  txHash && txHash !== 'No Transaction'
    ? `${txHash.slice(0, 8)}...${txHash.slice(-6)}`
    : null;

export default function Dao() {
  const [transactions, setTransactions] = useState<TransactionWithTimestamp[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [timeRemainingState, setTimeRemainingState] = useState<{
    [hash: string]: { hours: number; minutes: number; seconds: number };
  }>({}); // 남은 시간 상태
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [titles, setTitles] = useState<{ [onchainId: string]: string }>({}); // 타이틀 상태 추가
  const [delayMin, setDelayMin] = useState<number>(0);

  useEffect(() => {
    const data = async () => {
      try {
        const value = await fetchTimelockMinDelay();
        setDelayMin(value);
      } catch (error) {
        console.error('delay min fetching error', error);
      }
    };
    data();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true); // 트랜잭션 로딩 시작
        // 각 블록 범위에 대한 트랜잭션 호출을 병렬로 처리
        const promises = blockRanges.map(([startBlock, endBlock]) =>
          fetchTransactionsByBlockRange(
            L2_CORE_CORE_GOVERNOR_ADDRESS,
            BigInt(startBlock),
            BigInt(endBlock),
            import.meta.env.VITE_ARBISCAN_API_KEYS1,
            METHOD_ID_TO_CHECK
          )
        );

        // 모든 호출이 완료된 후 결과 결합
        const results = await Promise.all(promises);
        const allTransactions = results.flat(); // 여러 배열을 하나로 결합
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false); // 트랜잭션 로딩 완료
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const proposalData = await getProposals();
        setProposals(proposalData);

        const titlePromises = proposalData.map(async proposal => {
          const title = await getProposalTitle(proposal.onchainId);
          return { onchainId: proposal.onchainId, title: title || 'No Title' };
        });

        const titlesData = await Promise.all(titlePromises);
        const titlesMap = titlesData.reduce(
          (acc, { onchainId, title }) => {
            acc[onchainId] = title;
            return acc;
          },
          {} as { [onchainId: string]: string }
        );

        setTitles(titlesMap);
      } catch (error) {
        console.error('Error fetching proposals or titles:', error);
      }
    };

    fetchProposals();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 매 초마다 남은 시간을 업데이트
      if (delayMin > 0) {
        const newTimeRemaining = transactions.reduce(
          (acc, tx) => {
            const originalTimestamp = parseInt(tx.timeStamp, 10) * 1000; // Unix timestamp (milliseconds)
            const adjustedTimestamp = originalTimestamp + delayMin * 1000; // 추가된 timestamp 계산 (milliseconds)

            const now = Date.now();
            const timeLeft = Math.max(0, adjustedTimestamp - now); // 남은 시간이 0보다 작은 경우 0으로 설정

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            acc[tx.hash] = { hours, minutes, seconds }; // 트랜잭션 해시를 키로 해서 남은 시간 저장
            return acc;
          },
          {} as {
            [hash: string]: { hours: number; minutes: number; seconds: number };
          }
        );

        setTimeRemainingState(newTimeRemaining);
      }
    }, 1000); // 1초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [transactions, delayMin]);

  return (
    <BoxFrame title="DAO">
      {/* Proposal Table 추가 */}
      <Box sx={{ marginTop: '24px' }}>
        <h2>Latest Proposals</h2>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid black' }}
        >
          {' '}
          {/* 그림자 제거 */}
          <Table sx={{ borderCollapse: 'collapse' }}>
            {' '}
            {/* 테두리 선을 붙여서 표시 */}
            <TableHead>
              <TableRow sx={{ borderBottom: '1px solid black' }}>
                {' '}
                {/* 행 구분 줄 */}
                <TableCell
                  sx={{ borderRight: '1px solid black', paddingLeft: '16px' }}
                >
                  {' '}
                  {/* 셀 구분 줄 */}
                  Title
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderRight: '1px solid black' }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.length > 0 ? (
                proposals.map(proposal => (
                  <TableRow
                    key={proposal.id}
                    sx={{ borderBottom: '1px solid black' }}
                  >
                    {' '}
                    {/* 행 구분 줄 */}
                    <TableCell
                      sx={{
                        borderRight: '1px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      <Link
                        href={API_URLS.getTallyUrl(proposal.onchainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {titles[proposal.onchainId] || 'Loading...'}
                      </Link>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ borderRight: '1px solid black' }}
                    >
                      {proposal.status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ borderRight: '1px solid black' }}
                  >
                    No proposals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <SubtitleBox subtitle="Flow">
        <ContentBox>{DAO_CONTENTS.DAO_FLOW}</ContentBox>
      </SubtitleBox>

      <SubtitleBox subtitle="L2 Core Time Lock">
        <ContentBox>{DAO_CONTENTS.L2_CORE_TIMELOCK}</ContentBox>
      </SubtitleBox>

      {/* 트랜잭션 테이블 */}
      <Box sx={{ marginTop: '24px' }}>
        <h2>Latest Transactions of the L2Timelock</h2>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <CircularProgress /> {/* 로딩 중일 때 로딩 아이콘 표시 */}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Transaction Hash</TableCell>
                  <TableCell align="center">Timelock Start Timestamp</TableCell>
                  <TableCell align="center">Timelock End Timestamp</TableCell>
                  <TableCell align="center">
                    Time Remaining Until Timelock Ends
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map(tx => {
                    const originalTimestamp = parseInt(tx.timeStamp, 10) * 1000; // Unix timestamp (milliseconds)
                    const adjustedTimestamp =
                      originalTimestamp + delayMin * 1000; // 추가된 timestamp 계산 (milliseconds)
                    const remainingTime = timeRemainingState[tx.hash];

                    const isTimeRemaining =
                      remainingTime &&
                      (remainingTime.hours > 0 ||
                        remainingTime.minutes > 0 ||
                        remainingTime.seconds > 0);

                    return (
                      <TableRow key={tx.hash}>
                        <TableCell align="center">
                          <Link
                            href={API_URLS.getArbiscanTxUrl(tx.hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {formatTransactionHash(tx.hash)}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(originalTimestamp).toUTCString()}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(adjustedTimestamp).toUTCString()}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: isTimeRemaining ? 'red' : 'inherit',
                          }}
                        >
                          {isTimeRemaining && '⏱️'}{' '}
                          {remainingTime
                            ? `${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`
                            : '0h 0m 0s'}{' '}
                          {/* 남은 시간 표시 */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </BoxFrame>
  );
}
