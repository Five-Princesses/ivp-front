import { Box, Grid2, styled } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import ArbitrumLogo from '../../public/assets/arbitrum-arb-logo.png';
import PageHeader from '../components/common/PageHeader';
import SecurityCouncil from '../components/arbComponents/SecurityCouncil';
import BlobGraph from '../components/arbComponents/BlobGraph';
import ArbitrumStatus from '../components/arbComponents/arbitrumstatus/ArbitrumStatus';
import TabsManager from '../components/common/TabsManager';

function Arbitrum({
  setCurrentPath,
}: {
  setCurrentPath: (path: string) => void;
}) {
  const [activeSection, setActiveSection] = useState('status');
  const headerRef = useRef<HTMLDivElement>(null);
  const securityCouncilRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const blobGraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current
        ? headerRef.current.clientHeight + 45
        : 0;
      const scrollPosition = window.scrollY + headerHeight;

      // 각 ref가 `null`인지 확인 후 상태 업데이트
      if (
        statusRef.current &&
        scrollPosition >= statusRef.current.offsetTop &&
        blobGraphRef.current &&
        scrollPosition < blobGraphRef.current.offsetTop
      ) {
        setActiveSection('status');
      } else if (
        blobGraphRef.current &&
        scrollPosition >= blobGraphRef.current.offsetTop &&
        securityCouncilRef.current &&
        scrollPosition < securityCouncilRef.current.offsetTop
      ) {
        setActiveSection('gas');
      } else if (
        securityCouncilRef.current &&
        scrollPosition >= securityCouncilRef.current.offsetTop
      ) {
        setActiveSection('securitycouncil');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const handleTabChange = useCallback(
  //   (newValue: string) => {
  //     setActiveSection(newValue);

  //     const headerHeight = headerRef.current
  //       ? headerRef.current.clientHeight + 45
  //       : 0;

  //     if (newValue === 'status' && statusRef.current) {
  //       window.scrollTo({
  //         top: statusRef.current.offsetTop - headerHeight,
  //         behavior: 'smooth',
  //       });
  //     }
  //     if (newValue === 'gas' && blobGraphRef.current) {
  //       window.scrollTo({
  //         top: blobGraphRef.current.offsetTop - headerHeight,
  //         behavior: 'smooth',
  //       });
  //     }
  //     if (newValue === 'securitycouncil' && securityCouncilRef.current) {
  //       window.scrollTo({
  //         top: securityCouncilRef.current.offsetTop - headerHeight,
  //         behavior: 'smooth',
  //       });
  //     }
  //   },
  //   [headerRef, statusRef, blobGraphRef, securityCouncilRef]
  // );

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
        <TabsManager ref={headerRef} value={activeSection} />
      </Item>

      {/* 본문 섹션 */}
      <Item>
        <Box id="status">
          <ArbitrumStatus />
        </Box>
        <Box id="gas">
          {/* <BlobGraph call={fetch} /> */}
          <BlobGraph />
        </Box>
        <Box id="securitycouncil">
          <SecurityCouncil />
        </Box>
      </Item>
    </Grid2>
  );
}

export default Arbitrum;
