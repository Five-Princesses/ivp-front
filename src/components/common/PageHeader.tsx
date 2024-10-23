import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const handleItemClick = (path: string) => {
    try {
      setCurrentPath(path);
      navigate(path);
    } catch (error) {
      console.error(error);
    }
  };

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
        onClick={() => handleItemClick('/dashboard')}
        sx={{
          color: 'primary.main',
          mr: 2,
        }}
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>
      <Box
        component="img"
        src={logo}
        alt={`${name} Logo`}
        sx={{
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
