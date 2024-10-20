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
import fetchTransactionsByBlockRange from '../../utils/arbitrum/getScheduleTx';

// 트랜잭션 타입 정의
interface TransactionWithTimestamp {
  hash: string;
  timeStamp: string;
}

const addressToCheck = '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9';
const methodIdToCheck = '0x160cbed7'; // Method ID

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

// Arbiscan 트랜잭션 링크 생성 함수
const createLink = (txHash: string) => `https://arbiscan.io/tx/${txHash}`;

// 추가할 값(16진수)을 10진수로 변환
const additionalValue = 259200; // 0x3f480의 10진수 값

export default function Dao() {
  const [transactions, setTransactions] = useState<TransactionWithTimestamp[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [timeRemainingState, setTimeRemainingState] = useState<{
    [hash: string]: { hours: number; minutes: number; seconds: number };
  }>({}); // 남은 시간 상태

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true); // 트랜잭션 로딩 시작
        // 각 블록 범위에 대한 트랜잭션 호출을 병렬로 처리
        const promises = blockRanges.map(([startBlock, endBlock]) =>
          fetchTransactionsByBlockRange(
            addressToCheck,
            methodIdToCheck,
            startBlock,
            endBlock,
            import.meta.env.VITE_ARBISCAN_API_KEYS1
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
    const intervalId = setInterval(() => {
      // 매 초마다 남은 시간을 업데이트
      const newTimeRemaining = transactions.reduce(
        (acc, tx) => {
          const originalTimestamp = parseInt(tx.timeStamp, 10) * 1000; // Unix timestamp (milliseconds)
          const adjustedTimestamp = originalTimestamp + additionalValue * 1000; // 추가된 timestamp 계산 (milliseconds)

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
    }, 1000); // 1초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [transactions]);

  return (
    <BoxFrame title="DAO Transactions">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="In the case of an emergency upgrade, when a security threat is detected, swift action is required, so a long upgrade process like the proposer upgrade is not suitable. Therefore, the L2 Emergency Security Council immediately executes the L2 Upgrade Executor to upgrade all system contracts on Layer 2 (L2). Simultaneously, the L1 Emergency Security Council executes the Upgrade Executor to upgrade all system contracts on Layer 1 (L1). After the emergency upgrade is carried out, the Emergency Security Council is required to submit a transparency report regarding the upgrade." />
      </SubtitleBox>

      {/* 트랜잭션 테이블 */}
      <Box sx={{ marginTop: '24px' }}>
        <h1>DAO Transactions</h1>

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
                      originalTimestamp + additionalValue * 1000; // 추가된 timestamp 계산 (milliseconds)
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
                            href={createLink(tx.hash)}
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
