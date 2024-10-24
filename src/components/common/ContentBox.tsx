import React from 'react';
import { Box, Typography } from '@mui/material';
import { nanoid } from 'nanoid';

interface ContentBoxProps {
  children: React.ReactNode;
}

export default function ContentBox({ children }: ContentBoxProps) {
  const parseContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') {
      return content;
    }

    return content.split(/<br\s*\/?>/i).map(line => (
      <React.Fragment key={nanoid()}>
        {line}
        {line !== content.split(/<br\s*\/?>/i).pop() && <br />}
      </React.Fragment>
    )); // <br/> to newline
  };

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
      <Typography variant="body1" gutterBottom>
        {parseContent(children)}
      </Typography>
    </Box>
  );
}
