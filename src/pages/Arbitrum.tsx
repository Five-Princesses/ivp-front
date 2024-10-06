import { Box, Grid2, styled, Tab, Tabs } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import ArbitrumLogo from '../../public/assets/arbitrum-arb-logo.png';
import PageHeader from '../components/common/PageHeader';
import SecurityCouncil from '../components/arbComponents/SecurityCouncil';
import BlobGraph from '../components/arbComponents/BlobGraph';
import ArbitrumStatus from '../components/arbComponents/arbitrumstatus/ArbitrumStatus';

function Arbitrum({
  setCurrentPath,
}: {
  setCurrentPath: (path: string) => void;
}) {
  const [value, setValue] = React.useState('status');
  const headerRef = useRef<HTMLDivElement>(null);
  const securityCouncilRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const blobGraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.9 };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setValue(entry.target.id);
        }
      });
    }, observerOptions);

    if (securityCouncilRef.current)
      observer.observe(securityCouncilRef.current);
    if (statusRef.current) observer.observe(statusRef.current);
    if (blobGraphRef.current) observer.observe(blobGraphRef.current);

    return () => {
      if (securityCouncilRef.current)
        observer.unobserve(securityCouncilRef.current);
      if (statusRef.current) observer.unobserve(statusRef.current);
      if (blobGraphRef.current) observer.unobserve(blobGraphRef.current);
    };
  }, [value]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    const headerHeight = headerRef.current
      ? headerRef.current.clientHeight + 45
      : 0;

    if (newValue === 'status' && statusRef.current) {
      window.scrollTo({
        top: statusRef.current.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
    if (newValue === 'gas' && blobGraphRef.current) {
      window.scrollTo({
        top: blobGraphRef.current.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
    if (newValue === 'securitycouncil' && securityCouncilRef.current) {
      window.scrollTo({
        top: securityCouncilRef.current.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  };

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
      <Item ref={headerRef} sx={{ position: 'sticky', top: 65, zIndex: 10 }}>
        <PageHeader
          setCurrentPath={setCurrentPath}
          logo={ArbitrumLogo}
          name="Arbitrum"
        />
        {/* <Box id="this">
          {item ? (
            <Box
              style={{
                width: '100%',
                height: 118,
              }}
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height={118} />
          )}
        </Box> */}
        <Tabs value={value} onChange={handleChange}>
          <Tab value="status" label="Arbitrum Status" />
          <Tab value="gas" label="Gas Used" />
          <Tab value="securitycouncil" label="Security Council" />
        </Tabs>
      </Item>
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

export default Arbitrum;
