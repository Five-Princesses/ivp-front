import { Box, Grid2, styled } from '@mui/material';
import { useRef } from 'react';
import OptimismLogo from '../../public/assets/optimism-ethereum-op-logo.png';
import PageHeader from '../components/common/PageHeader';
import SecurityCouncil from '../components/optimism/SecurityCouncil';
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
          logo={OptimismLogo}
          name="Optimism"
        />
        {/* 각 섹션의 ref를 TabsManager에 전달 */}
        <TabsManager
          sectionsRef={{
            header: headerRef,
            status: statusRef,
            gas: blobGraphRef,
            securitycouncil: securityCouncilRef,
          }}
        />
      </Item>

      {/* 본문 섹션 */}
      <Item>
        <Box id="securitycouncil" ref={securityCouncilRef}>
          <SecurityCouncil />
        </Box>
      </Item>
    </Grid2>
  );
}
