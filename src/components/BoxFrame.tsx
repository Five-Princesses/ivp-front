import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SecurityCouncil() {
  return (
    <Box
      sx={{
        pt: 3,
        border: '2px solid black', // 박스 기본 테두리 색상
        '&:hover': {
          borderColor: 'red', // 마우스가 올라갔을 때 박스 테두리 빨간색
        },
        borderRadius: 2, // 둥근 테두리 모서리
        padding: 2, // 내부 여백
        mt: 4, // 박스 위쪽 여백
        mb: 4, // 박스 아래쪽 여백
      }}
    >
      {/* 제목 */}
      <Typography variant="h4" component="h2" gutterBottom>
        Security Council
      </Typography>

      {/* 내용 박스 */}
      <Box
        sx={{
          border: '1px solid black', // 내용 부분 기본 테두리 색상
          borderRadius: 1, // 내용 박스 테두리 모서리
          padding: 2, // 내용 내부 여백
          mt: 2, // 제목과의 간격
        }}
      >
        <Typography variant="body1" gutterBottom>
          test...
        </Typography>
      </Box>

      {/* 클릭 시 펼쳐지는 스크롤 가능한 컴포넌트 */}
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>More Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ height: 200, overflowY: 'auto' }}>
            <Typography>
              This is a scrollable content area. Add any additional details or
              information you want to display here.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
