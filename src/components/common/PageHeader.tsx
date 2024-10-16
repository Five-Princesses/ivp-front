import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PageHeader({
  setCurrentPath,
  logo,
  name,
}: {
  setCurrentPath: (path: string) => void;
  logo: string;
  name: string;
}) {
  return (
    <Box
      sx={{
        top: 65,
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        zIndex: 10,
        marginTop: '10px',
      }}
    >
      <IconButton
        onClick={() => setCurrentPath('/dashboard')}
        sx={{
          color: 'primary.main',
          mr: 2,
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <img
        src={logo}
        alt="Arbitrum Logo"
        style={{
          width: 50,
          height: 50,
          marginRight: '12px',
          borderRadius: '50%',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          fontSize: '32px',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}
