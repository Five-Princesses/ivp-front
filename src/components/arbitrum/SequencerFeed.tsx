import { Box, CircularProgress, Skeleton } from '@mui/material';
import { useState, useEffect } from 'react';
import BoxFrame from '../common/BoxFrame';
import SubtitleBox from '../common/SubtitleBox';
import ContentBox from '../common/ContentBox';
import CustomAccordion from '../common/CustomAccordion';
import DynamicTable from '../common/DynamicTable';
// import HorizontalLinearStepper from '../common/HorizontalLinearStepper';
// import L2BlockHash from './feeds/L2BlockHash';
// import SequencerFeedHash from './feeds/SequencerFeedHash';
// import SequencerFeedMsg from './feeds/SequencerFeedMsg';
// import SequencerFeedDetail from './feeds/SequencerFeedDetail';

interface TableData {
  id: number;
  feedBlockHash: string;
  l2BlockHash: string;
  status: string;
  timestamp: string;
}

interface SequencerMessage {}

const SEQUENCER_URI = 'wss://arb1.arbitrum.io/feed';

export default function SequencerFeed() {
  const [loading] = useState(false);
  const [dataFetched] = useState(false);
  const [messages, setMessages] = useState<SequencerMessage[]>([]);

  // const steps: string[] = [
  //   'Get Sequencer Feed Message',
  //   'Hash the message',
  //   'Compare the hash with the L2 block hash',
  // ];
  // const tempMessage =
  //   '{"version":1,"messages":[{"sequenceNumber":243170738,"message":{"message":{"header":{"kind":3,"sender":"0xa4b000000000000000000073657175656e636572","blockNumber":20998290,"timestamp":1729324962,"requestId":null,"baseFeeL1":null},"l2Msg":"AwAAAAAAAAC0BAL4sIKksYMMNb6Ag5iWgIMBmaGUeumrE/yJRTI7d4s/hngUXoDsLvuAuESpBZy7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3q0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABfXhAMCAoFpOd4qzvWDEf0IF4tUZfrgFAqHQQlxVEj3MbNVpY6pfoEiCCDK0V+MQUxxPcZjXtel0bVvK1XjSq4CS04hB95zeAAAAAAAAAPEEAvjtgqSxNoCDzf5ggwfag5R9btGGNUxzR0gln1kC3faispKTF4C4hJVi+sQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMABoHqCjPKTVjAvBYSifQN9il/vzbJ8RR8FafIGsZerxBRooGPliBn8345XpW1eHoW5QLFc+on6mnEMqiZuUymzEbblAAAAAAAAAxME+QMPg3CqZIO3GwCDMNQAlKe1GJvKhM0wTYVTl3x8YUMpdQ2ZgLkCpLFDBEsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbgAAAAAAAAAAAAAAAHueGE4Hpu4awj6uD+jWvi9mPwXmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZxO8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOQCI1NuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBJLRBVFP2exLiOd/6nUdRZJ4f59uZvIr3drDXsJK6N6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFEBAAAAAAAAaI8AAHZKAAAAAAAAAAAAAAAATuuk4WiyNgHrdxal0awkO403UpAAAHWeAAAAAAAAAAAAAAAAGc/OR+1UqIYUZI3D8ZpZgAlwB90AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGn2ulPmbl8RJGDNXuzQ24IT8u6DdddpNcU6DH3aMdcXVEX+N453F6DO+/+0+zPrk5y/GfHGh1lv5pYyOmEkKvPGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDAUmGoH7Bxn/JJzWvvMUlGfMa+4YLgUDZSXfaqifeRQ4de0NwoD3Qx+Pu1Ovcw9FbzZhvAzazChtlADWmYljvY8hhouqV"},"delayedMessagesRead":1724493}}]}';
  // //tempMessage를 JSON으로 파싱 후 문자열로 변환
  // const parsedMessage = JSON.stringify(JSON.parse(tempMessage), null, 2);
  useEffect(() => {
    // fetchData();
    const webSocket = new WebSocket(SEQUENCER_URI);

    webSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    webSocket.onmessage = message => {
      try {
        console.log('Received message:', message.data);
        if (messages) {
          setMessages([...messages, message.data]);
        }
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    };

    setTimeout(() => {
      webSocket.close();
      console.log('messages:', messages);
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
            initialRowsPerPage={5}
            style={{ width: '100%', height: '400px' }}
          />
          // <SequencerFeedDetail steps={steps}>
          //   <SequencerFeedMsg msg={parsedMessage} />
          //   <SequencerFeedHash />
          //   <L2BlockHash />
          // </SequencerFeedDetail>
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
