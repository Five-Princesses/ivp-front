import React, { ReactNode } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CustomAccordionProps {
  title: string;
  content: string | JSX.Element; // content는 string 또는 JSX Element
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void; // onChange 핸들러 추가
  children?: ReactNode; // 추가적인 children 요소
  loading: boolean; // 로딩 상태를 위한 prop 추가
}

export default function CustomAccordion({
  title,
  content,
  onChange,
  children,
  loading,
}: CustomAccordionProps) {
  return (
    <Accordion
      onChange={onChange}
      sx={{
        mt: 2,
        mb: 4,
        border: '1px solid black',
        borderRadius: 1,
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ overflowY: 'auto' }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {typeof content === 'string' ? (
                <Typography>{content}</Typography>
              ) : (
                content
              )}
              {children && <Box sx={{ mt: 2 }}>{children}</Box>}
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

// defaultProps 설정
CustomAccordion.defaultProps = {
  children: null, // children의 기본값을 null로 설정
};
