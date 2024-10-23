// import { useEffect } from 'react';
import { Box } from '@mui/material';
import DynamicTable from '../../common/DynamicTable';
import WasmProgress from '../../common/WasmProgress';
// import { SequencerMessage } from '../../../utils/common/types';
// import { arbitrumPublicClient } from '../../../utils/common/publicClient';

interface TableData {
  id: number;
  hash: string;
}

export default function L2BlockHash({
  hashes,
  //   loading,
  //   setLoading,
  //   isActive,
}: {
  hashes: string[] | undefined;
  //   loading: boolean;
  //   setLoading: (loading: boolean) => void;
  //   isActive: boolean;
}) {
  //   const getBlockHashes = async (): Promise<any> => {
  //     try {
  //       const response = await arbitrumPublicClient.getBlock();
  //       console.log('response:', response);
  //       return response;
  //     } catch (e) {
  //       console.error('Failed to fetch Arbitrum status:', e);
  //       return [];
  //     }
  //   };

  //   useEffect(() => {
  //     setLoading(true);
  //     getBlockHashes().then(response => {
  //       console.log('response:', response);
  //       setLoading(false);
  //     });

  //     if (hashes && hashes.length > 0) {
  //       setLoading(false);
  //     }

  //     return () => {
  //       setLoading(false);
  //     };
  //   }, [isActive, setLoading]);

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
      {!hashes ? (
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
