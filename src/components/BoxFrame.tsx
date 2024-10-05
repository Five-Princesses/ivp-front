import React from 'react';
import { Box, Typography } from '@mui/material';

interface BoxFrameProps {
  title: string;
  children: React.ReactNode;
}

export default function BoxFrame({ title, children }: BoxFrameProps) {
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
          {title}
        </Typography>

        {/* 자식 컴포넌트 렌더링 */}
        {children}
      </Box>
    </Box>
  );
}
