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
  const [status, setStatus] = useState<string[]>([]); // 트랜잭션 상태 저장
  const [allSuccess, setAllSuccess] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false); // 아코디언 상태 관리

  const handleSendTransactions = async () => {
    const txStatus: string[] = [];
    setExpanded(true); // Execute 버튼을 누르면 아코디언 자동으로 펼침

    try {
      // 각 트랜잭션의 진행 상황을 업데이트하는 함수
      const onProgress = (message: string, isSuccess: boolean = false) => {
        const latestStatus = isSuccess ? `${message} ✅` : `${message}...`;
        // 마지막 항목을 덮어쓰지 않고 상태 업데이트
        txStatus.push(latestStatus);
        setStatus([...txStatus]);
      };

      // sendBatchTx 실행
      const result = await sendBatchTx(onProgress);

      // 전체 트랜잭션이 완료되었는지 확인
      if (result.success) {
        setAllSuccess(true);
      } else {
        txStatus.push('Transaction Failed!');
        setAllSuccess(false);
      }
    } catch (error) {
      txStatus.push('Transaction Failed with Error!');
      setAllSuccess(false);
      setStatus([...txStatus]);
    }
  };

  return (
    <BoxFrame title="Detecting MEV">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="">
          You Can Execute Script for Detecting MEV.
        </ContentBox>
      </SubtitleBox>

      {/* 트랜잭션 실행 버튼 */}
      <Box sx={{ marginTop: '24px' }}>
        <Button variant="contained" onClick={handleSendTransactions}>
          Execute Batch Transactions
        </Button>
      </Box>

      {/* 트랜잭션 목록 */}
      {status.length > 0 && (
        <Accordion expanded={expanded} sx={{ marginTop: '24px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Transaction Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {status.map(tx => (
                <li key={tx}>{tx}</li>
              ))}
            </ul>

            {/* 모든 트랜잭션이 성공했을 경우 메시지 출력 */}
            {allSuccess && (
              <Typography>There is no MEV Attack by Sequencer</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </BoxFrame>
  );
}
