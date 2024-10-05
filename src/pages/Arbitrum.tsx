import { Box, Skeleton, Tab, Tabs } from '@mui/material';
import React from 'react';
import ArbitrumLogo from '../../public/assets/arbitrum-arb-logo.png';
import PageHeader from '../components/PageHeader';
import SecurityCouncil from '../components/arbComponents/SecurityCouncil';
import BoxFrameEx from '../components/BoxFrameEx';

function Arbitrum({
  setCurrentPath,
  item,
}: {
  setCurrentPath: (path: string) => void;
  item: { title: string; src: string } | null;
}) {
  const [value, setValue] = React.useState('one');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
      }}
    >
      <PageHeader
        setCurrentPath={setCurrentPath}
        logo={ArbitrumLogo}
        name="Arbitrum"
      />
      <Box>
        {item ? (
          <img
            style={{
              width: '100%',
              height: 118,
            }}
            alt={item.title}
            src={item.src}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={118} />
        )}
      </Box>
      <Box
        sx={{
          position: 'sticky',
          top: 115,
          zIndex: 10,
          backgroundColor: 'white',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="one" label="Item One" />
          <Tab value="two" label="Item Two" />
          <Tab value="three" label="Item Three" />
        </Tabs>
      </Box>
      <SecurityCouncil />
      <BoxFrameEx />
      <BoxFrameEx />

      {/* primitive Box Ex */}
      {/* <Box sx={{ pt: 3 }}>
        {item ? (
          <img
            style={{
              width: '100%',
              height: 400,
              marginTop: 16,
            }}
            alt={item.title}
            src={item.src}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={400} />
        )}
      </Box> */}
    </Box>
  );
}

export default Arbitrum;
