import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import sendBatchTx from '../../utils/arbitrum/sendBatchTx'; // sendBatchScript 함수 가져오기
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';

export default function BatchScript() {
  const [transactions, setTransactions] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]); // 트랜잭션 상태 저장
  const [allSuccess, setAllSuccess] = useState<boolean | null>(null);

  const handleSendTransactions = async () => {
    const txResults: string[] = [];
    const txStatus: string[] = [];

    try {
      const result = await sendBatchTx();

      // 트랜잭션이 성공적으로 처리되었는지 여부 확인
      if (result.success) {
        txStatus.push('Create Contract... Success!');
        txResults.push(result.message);

        // 성공적으로 처리된 트랜잭션 목록을 업데이트
        setTransactions(txResults);
        setStatus(txStatus);

        setAllSuccess(true);
      } else {
        txStatus.push('Transaction Failed!');
        setAllSuccess(false);
      }
    } catch (error) {
      txStatus.push('Transaction Failed with Error!');
      console.error(error);
      setAllSuccess(false);
    }
  };

  return (
    <BoxFrame title="Detecting MEV">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="">
          You Can Excute Script for Detecting MEV.
        </ContentBox>
      </SubtitleBox>

      {/* 트랜잭션 실행 버튼 */}
      <Box sx={{ marginTop: '24px' }}>
        <Button variant="contained" onClick={handleSendTransactions}>
          Execute Batch Transactions
        </Button>
      </Box>

      {/* 트랜잭션 목록 */}
      {transactions.length > 0 && (
        <Accordion sx={{ marginTop: '24px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Transaction Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {transactions.map((tx, index) => (
                <li key={tx}>
                  {tx}: {status[index]}
                </li>
              ))}
            </ul>

            {/* 모든 트랜잭션이 성공했을 경우 메시지 출력 */}
            {allSuccess && (
              <Typography>There is not MEV Attack by Sequencer</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </BoxFrame>
  );
}
