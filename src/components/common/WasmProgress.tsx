import { Box, Typography } from '@mui/material';

export default function WasmProgress() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src="/assets/Go lang Mascot by Kirael-Art on DeviantArt.gif"
        alt="Loading..."
        sx={{ width: '200px', mb: 2 }}
      />
      <Typography variant="body1">wasm을 통해 message 분석중...</Typography>
    </Box>
  );
}
