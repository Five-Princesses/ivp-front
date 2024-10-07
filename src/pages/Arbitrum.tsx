import { Box, Grid2, styled } from '@mui/material';
import { useRef, useCallback } from 'react';
import ArbitrumLogo from '../../public/assets/arbitrum-arb-logo.png';
import PageHeader from '../components/common/PageHeader';
import SecurityCouncil from '../components/arbComponents/SecurityCouncil';
import BlobGraph from '../components/arbComponents/BlobGraph';
import ArbitrumStatus from '../components/arbComponents/arbitrumstatus/ArbitrumStatus';
import TabsManager from '../components/common/TabsManager';

export default function Arbitrum({
  setCurrentPath,
}: {
  setCurrentPath: (path: string) => void;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const securityCouncilRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const blobGraphRef = useRef<HTMLDivElement>(null);

  // 탭 변경 시 스크롤 이동 처리
  const handleTabChange = useCallback((newValue: string) => {
    const headerHeight = headerRef.current
      ? headerRef.current.clientHeight + 45
      : 0;

    const sectionMap = {
      status: statusRef.current,
      gas: blobGraphRef.current,
      securitycouncil: securityCouncilRef.current,
    };

    const targetSection =
      sectionMap[newValue as 'status' | 'gas' | 'securitycouncil'];

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  return (
    <Grid2
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        overflow: 'visible',
      }}
    >
      {/* 헤더 섹션 */}
      <Item ref={headerRef} sx={{ position: 'sticky', top: 65, zIndex: 10 }}>
        <PageHeader
          setCurrentPath={setCurrentPath}
          logo={ArbitrumLogo}
          name="Arbitrum"
        />
        <TabsManager onTabChange={handleTabChange} />
      </Item>

      {/* 본문 섹션 */}
      <Item>
        <Box id="status" ref={statusRef}>
          <ArbitrumStatus />
        </Box>
        <Box id="gas" ref={blobGraphRef}>
          <BlobGraph />
        </Box>
        <Box id="securitycouncil" ref={securityCouncilRef}>
          <SecurityCouncil />
        </Box>
      </Item>
    </Grid2>
  );
}
