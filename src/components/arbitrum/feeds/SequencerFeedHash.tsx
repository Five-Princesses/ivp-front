import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DynamicTable from '../../common/DynamicTable';
import WasmProgress from '../../common/WasmProgress';
import { SequencerMessage } from '../../../utils/common/types';

interface TableData {
  id: number;
  hash: string;
}

export default function SequencerFeedHash({
  hashes,
  loading,
  setLoading,
  isActive,
  prevMessage,
  pickMessage,
}: {
  hashes: string[] | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isActive: boolean;
  prevMessage: SequencerMessage | undefined;
  pickMessage: SequencerMessage | undefined;
}) {
  const [thisLoading, setThisLoading] = useState(false);

  const tempCallWasm = () => {
    // console.log('Call wasm');
    console.log('prevMessage:', prevMessage);
    console.log('pickMessage:', pickMessage);

    // TODO: Call wasm
    return [];
  };

  useEffect(() => {
    if (isActive) {
      setThisLoading(true);
      setLoading(true); // Trigger loading state when step becomes active

      console.log('isActive:', isActive);
      console.log('loading:', loading);

      tempCallWasm();
      // Simulate a wasm call or other processing here
      setTimeout(() => {
        setLoading(false);
        setThisLoading(false);
        console.log('loading:', loading);
      }, 2000);
    }
  }, [isActive, setLoading]);

  const columns: (keyof TableData)[] = ['id', 'hash'];

  const data: TableData[] = hashes
    ? hashes.map((hash, index) => ({ id: index + 1, hash }))
    : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 2,
        position: 'relative',
        width: '100%',
        height: '400px',
      }}
    >
      {thisLoading ? (
        <WasmProgress />
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
      )}
    </Box>
  );
}
