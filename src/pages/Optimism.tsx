import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import OptimizmLogo from '../../public/assets/optimism-ethereum-op-logo.png';

function Optimism({
  setCurrentPath,
}: {
  setCurrentPath: (path: string) => void;
}) {
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
        logo={OptimizmLogo}
        name="Optimism"
      />
    </Box>
  );
}

export default Optimism;
