import React, { useEffect, useState } from 'react';
import {
  Box,
  Skeleton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Link,
} from '@mui/material';
import {
  getL1toL2PairTxInfo,
  IL1toL2PairTx,
} from '../../utils/arbitrum/getDelayedInboxTx';

import { API_URLS } from '../../constants/common/url';

import { DEPOSIT_ETH_SIGNATURE } from '../../constants/arbitrum/functionSignature';

import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import { DELAYED_INBOX_CONTENTS } from '../../constants/arbitrum/contents';

function DelayedInboxTxStatus() {
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [l1toL2PairTxList, setL1toL2PairTxList] = useState<IL1toL2PairTx[]>([]);
  const [timeRemainingState, setTimeRemainingState] = useState<{
    [hash: string]: { hours: number; minutes: number; seconds: number };
  }>({}); // 남은 시간 상태

  const createLink = (address: string | null | undefined, isL1: boolean) => {
    if (!address) {
      return '#';
    }

    if (isL1) {
      return API_URLS.getEtherscanTxUrl(address);
    }
    return API_URLS.getArbiscanTxUrl(address);
  };

  const handleAccordionChange = async (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded) {
      setL1toL2PairTxList(await getL1toL2PairTxInfo());
      setLoading(false);
    }
  };

  const formatTransactionHash = (txHash: string | null) =>
    txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : 'No Transaction'; // 'No Transaction'일 때 축약하지 않음

  //   useEffect(() => {}, [l1toL2PairTxList]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 매 초마다 남은 시간을 업데이트
      const newTimeRemaining = l1toL2PairTxList.reduce(
        (acc, tx) => {
          const originalTimestamp = Number(tx.l1Timestamp) * 1000; // Unix timestamp (milliseconds)
          const adjustedTimestamp = originalTimestamp + 86400 * 1000; // 추가된 timestamp 계산 (milliseconds)

          const now = Date.now();
          const timeLeft = Math.max(0, adjustedTimestamp - now); // 남은 시간이 0보다 작은 경우 0으로 설정

          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          acc[tx.l1TxHash] = { hours, minutes, seconds }; // 트랜잭션 해시를 키로 해서 남은 시간 저장
          return acc;
        },
        {} as {
          [hash: string]: { hours: number; minutes: number; seconds: number };
        }
      );

      setTimeRemainingState(newTimeRemaining);
    }, 1000); // 1초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [l1toL2PairTxList]);

  return (
    <BoxFrame title="Delayed Inbox">
      <SubtitleBox subtitle="Delayed Inbox Tx">
        <ContentBox>{DELAYED_INBOX_CONTENTS.DELAYED_INBOX_STATUS}</ContentBox>
      </SubtitleBox>

      <Box sx={{ marginTop: '24px' }}>
        {loading ? (
          <CustomAccordion
            title="More Details"
            loading={loading}
            content={
              <Skeleton
                style={{
                  minWidth: '50px',
                  width: '100%',
                  height: '50px',
                }}
              />
            }
            onChange={handleAccordionChange}
          >
            <Box>
              <Skeleton
                width="100%"
                height="20px"
                sx={{ marginBottom: '8px', minWidth: '50px' }}
              />
              <Skeleton
                style={{ minWidth: '50px', width: '100%', height: '20px' }}
              />
            </Box>
          </CustomAccordion>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ border: '1px solid black' }}>
                    Tx Hash : L1
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black' }}>
                    Tx Hash : L2
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black' }}>
                    Calldata Pair
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black' }}>
                    ETH Pair
                  </TableCell>
                  <TableCell align="center" sx={{ border: '1px solid black' }}>
                    Forced Inclusion
                    <br />
                    Remaining Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {l1toL2PairTxList.length > 0 ? (
                  l1toL2PairTxList.map(pairTx => {
                    let calldataPair = '';
                    let etherPair = '';
                    if (pairTx.l2TxHash) {
                      if (pairTx.l1Input === DEPOSIT_ETH_SIGNATURE) {
                        calldataPair = 'depositETH';
                      } else if (
                        pairTx.estL2Calldata === pairTx.l2CRTCalldata
                      ) {
                        calldataPair = 'Same calldata';
                      } else {
                        calldataPair = 'not Same calldata';
                      }

                      if (pairTx.l1Value === pairTx.l2Value) {
                        etherPair = 'Same ether value';
                      } else {
                        etherPair = 'not same ether value';
                      }
                    } else {
                      etherPair = 'No transaction';
                      calldataPair = 'No transaction';
                    }

                    const remainingTime = timeRemainingState[pairTx.l1TxHash];
                    const isTimeRemaining =
                      remainingTime &&
                      !pairTx.l2TxHash &&
                      (remainingTime.hours > 0 ||
                        remainingTime.minutes > 0 ||
                        remainingTime.seconds > 0);

                    return (
                      <TableRow key={pairTx.l1TxHash}>
                        <TableCell
                          align="center"
                          sx={{ border: '1px solid black' }}
                        >
                          {pairTx.l1TxHash ? (
                            <Link
                              href={createLink(pairTx.l1TxHash, true)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formatTransactionHash(pairTx.l1TxHash)}
                            </Link>
                          ) : (
                            'No transaction'
                          )}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{ border: '1px solid black' }}
                        >
                          {pairTx.l2TxHash ? (
                            <Link
                              href={createLink(pairTx.l2TxHash, false)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formatTransactionHash(pairTx.l2TxHash)}
                            </Link>
                          ) : (
                            'No transaction'
                          )}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{ border: '1px solid black' }}
                        >
                          {calldataPair}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{ border: '1px solid black' }}
                        >
                          {etherPair}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: isTimeRemaining ? 'red' : 'inherit',
                            border: '1px solid black',
                          }}
                        >
                          {remainingTime && !pairTx.l2TxHash
                            ? `⏱️ ${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`
                            : 'L2 transaction succeed'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ border: '1px solid black' }}
                    >
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

export default DelayedInboxTxStatus;
