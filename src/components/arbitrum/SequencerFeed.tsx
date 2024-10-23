import { Box, CircularProgress, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import L2BlockHash from './feeds/L2BlockHash';
import SequencerFeedHash from './feeds/SequencerFeedHash';
import SequencerFeedMsg from './feeds/SequencerFeedMsg';
import SequencerFeedDetail from './feeds/SequencerFeedDetail';
import { SequencerMessage } from '../../utils/common/types';
import CompareFeedAndL2 from './feeds/CompareFeedAndL2';

const SEQUENCER_URI = 'wss://arb1.arbitrum.io/feed';

export default function SequencerFeed() {
  const [loading, setLoading] = useState(false);
  const [dataFetched] = useState(false);
  const [messages, setMessages] = useState<SequencerMessage[]>([]);
  const [prevMessage, setPrevMessage] = useState<SequencerMessage>();
  const [pickMessage, setPickMessage] = useState<SequencerMessage>();
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [activeStep] = useState(0);
  const [feedHashes] = useState<string[]>([
    '0xa1b2c3d4e5f6',
    '0x1a2b3c4d5e6f',
    '0x2a3b4c5d6e7f',
    '0x3a4b5c6d7e8f',
    '0x4a5b6c7d8e9f',
  ]);
  const [l2Hashes] = useState<string[]>([
    '0xa1b2c3d4e5f6',
    '0x1a2b3c4d5e6f',
    '0x2a3b4c5d6e7f',
    '0x3a4b5c6d7e8f',
    '0x4a5b6c7d8e9f',
  ]);

  const steps: string[] = [
    'Get Sequencer Feed Message',
    'Hash the message',
    'Compare the hash with the L2 block hash',
  ];

  useEffect(() => {
    if (isAccordionExpanded) {
      const webSocket = new WebSocket(SEQUENCER_URI);

      webSocket.onopen = () => {
        setIsSocketOpen(true);
        console.log('WebSocket connected');
      };

      webSocket.onmessage = message => {
        try {
          // console.log('Received message:', message.data);
          const parsedMessage = JSON.parse(message.data);
          setMessages(prevMessages => [...prevMessages, parsedMessage]);
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };

      const timeoutId = setTimeout(() => {
        console.log('Closing WebSocket after 10 seconds');
        webSocket.close();
        setIsSocketOpen(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.close();
        }
      };
    }
    return undefined;
  }, [isAccordionExpanded]);

  useEffect(() => {
    if (!isSocketOpen) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      // console.log('randomIndex:', randomIndex);
      // console.log('randomMessage:', messages[randomIndex]);
      setPickMessage(messages[randomIndex]);
      setPrevMessage(messages[randomIndex - 1]);
      console.log('prevMessage:', messages[randomIndex - 1]);
      console.log('pickMessage:', messages[randomIndex]);
    }
  }, [isSocketOpen]);

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    if (isExpanded && !dataFetched) {
      setIsAccordionExpanded(true);
    }
  };
  const renderTable = () => {
    return (
      <Box
        sx={{
          border: '0.9px solid black',
        }}
      >
        {loading ? (
          <Box position="relative" width="100%">
            {/* Skeleton serves as the background */}
            <Skeleton variant="rectangular" width="100%" height={400} />

            {/* CircularProgress centered over Skeleton */}
            <Box position="absolute" top="50%" left="50%">
              <CircularProgress />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: 2,
              borderRadius: 1,
            }}
          >
            <SequencerFeedDetail steps={steps}>
              <SequencerFeedMsg
                msg={pickMessage ? JSON.stringify(pickMessage, null, 2) : ''}
                loading={loading}
                setLoading={setLoading}
              />
              <SequencerFeedHash
                hashes={feedHashes}
                loading={loading}
                setLoading={setLoading}
                prevMessage={prevMessage}
                pickMessage={pickMessage}
                isActive={activeStep === 1}
              />
              <L2BlockHash
                hashes={l2Hashes}
                // loading={loading}
                // setLoading={setLoading}
                // isActive={activeStep === 2}
              />
              <CompareFeedAndL2 />
            </SequencerFeedDetail>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <BoxFrame title="Sequencer Feed">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="">add something</ContentBox>
      </SubtitleBox>

      {/* 컴포넌트 상세 설명 아코디언 */}

      <CustomAccordion
        title="More Details"
        content={renderTable()}
        onChange={handleAccordionChange}
        loading={loading}
      >
        {/* 아코디언 내용 */}
        <p>Accordion Content</p>
      </CustomAccordion>
    </BoxFrame>
  );
}
