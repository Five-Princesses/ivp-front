import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import fetchTransactionsByBlockRange from '../../utils/arbitrum/getScheduleTx'; // 위에서 작성한 함수

const addressToCheck = '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9';
const methodIdToCheck = '0x160cbed7'; // Method ID

// 원하는 블록 범위 설정
const blockRanges = [
  [0, 99999999],
  [243167568, 243167568],
  [220085905, 220085905],
  // 필요한 만큼 범위를 추가
];

export default function Dao() {
  const [transactions, setTransactions] = useState<string[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
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
      }
    };

    fetchTransactions();
  }, []);

  return (
    <BoxFrame title="DAO Transactions">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="In the case of an emergency upgrade, when a security threat is detected, swift action is required, so a long upgrade process like the proposer upgrade is not suitable. Therefore, the L2 Emergency Security Council immediately executes the L2 Upgrade Executor to upgrade all system contracts on Layer 2 (L2). Simultaneously, the L1 Emergency Security Council executes the Upgrade Executor to upgrade all system contracts on Layer 1 (L1). After the emergency upgrade is carried out, the Emergency Security Council is required to submit a transparency report regarding the upgrade." />
      </SubtitleBox>

      {/* 트랜잭션 목록 */}
      <Box sx={{ marginTop: '24px' }}>
        <h1>DAO Transactions</h1>
        <ul>
          {transactions.map(tx => (
            <li key={tx}>{tx}</li> // 트랜잭션 해시를 고유한 key로 사용
          ))}
        </ul>
      </Box>
    </BoxFrame>
  );
}
