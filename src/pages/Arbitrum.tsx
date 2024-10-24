import { Box, Grid2, styled } from '@mui/material';
import { useRef } from 'react';
import ArbitrumLogo from '../../public/assets/arbitrum-arb-logo.png';
import PageHeader from '../components/common/PageHeader';
import TabsManager from '../components/common/TabsManager';
import SecurityCouncil from '../components/arbitrum/SecurityCouncil';
import BlobGraph from '../components/arbitrum/BlobGraph';
import ArbitrumStatus from '../components/arbitrum/ArbitrumStatus';
import SequencerFeed from '../components/arbitrum/SequencerFeed';
import Dao from '../components/arbitrum/Dao';
import DelayedInboxTxStatus from '../components/arbitrum/DelayedInboxTxStatus';

export default function Arbitrum({
  setCurrentPath,
}: {
  setCurrentPath: (path: string) => void;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const securityCouncilRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const blobGraphRef = useRef<HTMLDivElement>(null);
  const sequencerFeedRef = useRef<HTMLDivElement>(null);
  const daoRef = useRef<HTMLDivElement>(null);
  const delayedInboxTxStatusRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { value: 'status', label: 'Arbitrum Status' },
    { value: 'gas', label: 'Gas Used' },
    { value: 'sequencerfeed', label: 'Sequencer Feed' },
    { value: 'securitycouncil', label: 'Security Council' },
    { value: 'dao', label: 'Dao' },
    { value: 'delayedinboxtxstatus', label: 'DelayedInbox' },
  ];

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
        {/* 각 섹션의 ref를 TabsManager에 전달 */}
        <TabsManager
          sectionsRef={{
            header: headerRef,
            status: statusRef,
            gas: blobGraphRef,
            sequencerfeed: sequencerFeedRef,
            securitycouncil: securityCouncilRef,
            dao: daoRef,
            delayedinboxtxstatus: delayedInboxTxStatusRef,
          }}
          tabs={tabs}
        />
      </Item>

      {/* 본문 섹션 */}
      <Item>
        <Box id="status" ref={statusRef}>
          <ArbitrumStatus />
        </Box>
        <Box id="gas" ref={blobGraphRef}>
          <BlobGraph />
        </Box>
        <Box id="sequencerfeed" ref={sequencerFeedRef}>
          <SequencerFeed />
        </Box>
        <Box id="securitycouncil" ref={securityCouncilRef}>
          <SecurityCouncil />
        </Box>
        <Box id="dao" ref={daoRef}>
          <Dao />
        </Box>
        <Box id="delayedinboxtxstatus" ref={delayedInboxTxStatusRef}>
          <DelayedInboxTxStatus />
        </Box>
      </Item>
    </Grid2>
  );
}
