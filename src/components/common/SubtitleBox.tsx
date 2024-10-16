import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';

interface SubtitleBoxProps {
  subtitle: string;
  children?: ReactNode;
}

export default function SubtitleBox({ subtitle, children }: SubtitleBoxProps) {
  return (
    <>
      <Typography variant="h5" component="h3" gutterBottom>
        {subtitle}
      </Typography>

      {children}
    </>
  );
}

// defaultProps 설정
SubtitleBox.defaultProps = {
  children: null, // 기본값 설정
};
