import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Arbitrum from './pages/Arbitrum';
import Optimism from './pages/Optimism';

interface IDummydata {
  [category: string]: { name: string; path: string }[];
}

export default function MainDashboard() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const dummyData: IDummydata = {
    Scaling: [
      { name: 'OP Mainnet', path: '/scaling/op-mainnet' },
      { name: 'Arbitrum', path: '/scaling/arbitrum' },
      { name: 'Base', path: '/scaling/base' },
      { name: 'Blast', path: '/scaling/blast' },
      { name: 'Mantle', path: '/scaling/mantle' },
      { name: 'Scroll', path: '/scaling/scroll' },
    ],
    DeFi: [
      { name: 'Compound', path: '/defi/compound' },
      { name: 'Curve', path: '/defi/curve' },
      { name: 'Lido', path: '/defi/lido' },
      { name: 'AAVE', path: '/defi/aave' },
      { name: 'EigenLayer', path: '/defi/eigenlayer' },
      { name: 'ether.fi', path: '/defi/etherfi' },
    ],
    Bridges: [
      { name: 'LayerZero v2 OFTs', path: '/bridges/layerzero' },
      { name: 'Ronin V3', path: '/bridges/ronin' },
      { name: 'Portal (Wormhole)', path: '/bridges/portal' },
      { name: 'Multichain', path: '/bridges/multichain' },
      { name: 'Stargate', path: '/bridges/stargate' },
      { name: 'Connext', path: '/bridges/connext' },
    ],
  };

  const handleItemClick = (path: string) => {
    setCurrentPath(path);
  };

  const renderCategory = (
    category: string,
    items: { name: string; path: string }[]
  ) => (
    <Paper
      sx={{
        width: '95%',
        height: '350px',
        mt: 2,
        ml: 2,
        borderRadius: '16px',
      }}
      elevation={3}
    >
      <Box sx={{ width: '100%', height: '50px' }}>
        <Typography variant="h4" sx={{ pt: 2, pl: 2 }}>
          {category}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {items.map(({ name, path }) => (
          <Box
            key={name}
            onClick={() => handleItemClick(path)}
            sx={{
              width: '225px',
              height: '225px',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ml: 2,
              mt: 2,
              border: '1px solid gray',
            }}
          >
            {name}
          </Box>
        ))}
      </Box>
    </Paper>
  );

  // 경로에 따라 다른 컴포넌트 렌더링
  const renderPageContent = () => {
    switch (currentPath) {
      case '/dashboard':
        return (
          <Box>
            {Object.entries(dummyData).map(([category, items]) =>
              renderCategory(category, items)
            )}
          </Box>
        );
      case '/scaling/arbitrum':
        return (
          <Arbitrum
            setCurrentPath={setCurrentPath}
            item={{ title: '', src: '' }}
          />
        );
      case '/scaling/op-mainnet':
        return <Optimism setCurrentPath={setCurrentPath} />;
      default:
        return (
          <Box>
            {Object.entries(dummyData).map(([category, items]) =>
              renderCategory(category, items)
            )}
          </Box>
        );
    }
  };

  return <Box sx={{ width: '100%' }}>{renderPageContent()}</Box>;
}
