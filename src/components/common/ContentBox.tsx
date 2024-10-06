import React from 'react';
import { Box, Typography } from '@mui/material';

interface ContentBoxProps {
  content: string | JSX.Element; // content가 string 또는 JSX Element를 받을 수 있도록 변경
}

export default function ContentBox({ content }: ContentBoxProps) {
  return (
    <Box
      sx={{
        border: '1px solid black', // 내용 부분 기본 테두리 색상
        borderRadius: 1, // 내용 박스 테두리 모서리
        padding: 2, // 내용 내부 여백
        mt: 2, // 제목과의 간격
        mb: 2,
      }}
    >
      {/* content가 문자열인지 JSX인지에 따라 다르게 처리 */}
      {typeof content === 'string' ? (
        <Typography variant="body1" gutterBottom>
          {content}
        </Typography>
      ) : (
        content
      )}
    </Box>
  );
}
