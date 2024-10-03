import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function BoxFrame() {
  return (
    <Box
      sx={{
        display: 'flex', // Flexbox 사용
        justifyContent: 'center', // 가로 가운데 정렬
      }}
    >
      <Box
        sx={{
          width: '90%',
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
          Default BoxFrameTest
        </Typography>

        {/* 소제목 */}
        <Typography variant="h5" component="h3" gutterBottom>
          Summary
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
        <Accordion
          sx={{
            mt: 2,
            mb: 4,
            border: '1px solid black', // 아코디언 테두리 추가
            borderRadius: 1, // 둥근 테두리 모서리
            '&:before': {
              display: 'none', // 아코디언 기본 하이라이트 제거
            },
          }}
        >
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
    </Box>
  );
}
