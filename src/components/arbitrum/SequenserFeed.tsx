import { Box, CircularProgress, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import DynamicTable from '../common/DynamicTable';

interface TableData {
  id: number;
  feedBlockHash: string;
  l2BlockHash: string;
  status: string;
  timestamp: string;
}

// interface SequencerMessage {}

const SEQUENCER_URI = 'wss://arb1.arbitrum.io/feed';

export default function SequenserFeed() {
  const [loading] = useState(false);
  const [dataFetched] = useState(false);
  // const [messages, setMessages] = useState<SequencerMessage[]>([]);

  useEffect(() => {
    // fetchData();
    const webSocket = new WebSocket(SEQUENCER_URI);

    webSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    webSocket.onmessage = message => {
      console.log('Received message:', message.data);
    };

    setTimeout(() => {
      webSocket.close();
    }, 10000);
  }, []);

  const data: TableData[] = [
    {
      id: 1,
      feedBlockHash: '0x1234567890abcdef',
      l2BlockHash: '0x1234567890abcdef',
      status: 'matched',
      timestamp: '2024-10-17 16:00:00',
    },
    {
      id: 2,
      feedBlockHash: '0xabcdef1234567890',
      l2BlockHash: '0x1234567890abcdef',
      status: 'mismatch',
      timestamp: '2024-10-17 16:30:00',
    },
    {
      id: 2,
      feedBlockHash: '0xabcdef1234567890',
      l2BlockHash: '0x1234567890abcdef',
      status: 'mismatch',
      timestamp: '2024-10-17 16:30:00',
    },
    {
      id: 2,
      feedBlockHash: '0xabcdef1234567890',
      l2BlockHash: '0x1234567890abcdef',
      status: 'mismatch',
      timestamp: '2024-10-17 16:30:00',
    },
    {
      id: 2,
      feedBlockHash: '0xabcdef1234567890',
      l2BlockHash: '0x1234567890abcdef',
      status: 'mismatch',
      timestamp: '2024-10-17 16:30:00',
    },
  ];

  const columns: (keyof TableData)[] = [
    'id',
    'feedBlockHash',
    'l2BlockHash',
    'status',
    'timestamp',
  ];

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    console.log('isLoading:', loading);
    if (isExpanded && !dataFetched) {
      // fetchData();
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
          <DynamicTable
            data={data}
            columns={columns}
            enableSorting={false}
            enablePagination={false}
            enableFilter={false}
            rowsPerPageOptions={[5, 10, 20]}
            initialRowsPerPage={0}
            style={{ width: '100%', height: '400px' }}
          />
        )}
      </Box>
    );
  };

  return (
    <BoxFrame title="Sequencer Feed">
      {/* 제목 및 설명 */}
      <SubtitleBox subtitle="subtitle">
        <ContentBox content="content" />
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
