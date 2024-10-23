import { CircularProgress, TextField, Box } from '@mui/material';
import { useEffect, useState } from 'react';

export default function SequencerFeedMsg({
  msg,
  loading,
  setLoading,
}: {
  msg: string | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  //   const [loading, setLoading] = useState(true); // State to track loading status
  const [dots, setDots] = useState(''); // State to track the number of dots for "Collecting..."
  //   const loading = true;

  // Effect to update the loading state based on whether a message has been received
  useEffect(() => {
    // Start loading
    setLoading(true);

    // Stop loading when a message is received
    if (msg && msg.length > 0) {
      setLoading(false);
    }

    // Clean up by setting loading to false on unmount
    return () => {
      setLoading(false);
    };
  }, [msg, setLoading]);

  // Effect to create animated "Collecting..." dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length === 4 ? '' : `${prev}.`)); // Add dots up to 4, then reset
    }, 500); // Update every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [loading]);

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
      {!msg ? (
        <>
          <TextField
            id="outlined-multiline-static"
            label="Feed Message Collecting"
            multiline
            rows={16}
            value={`Feed Message Collecting${dots}`} // Show the dynamic collecting message
            InputProps={{
              readOnly: true,
            }}
            sx={{
              position: 'relative', // Set relative position for the CircularProgress to be centered
              height: '400px', // Set height to match the CircularProgress
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1, // Ensure it's on top of the text
            }}
          >
            <CircularProgress />
          </Box>
        </>
      ) : (
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={16}
          value={msg || 'No message available'}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            position: 'relative',
            height: '100%', // Ensure the text field fills the height
          }}
        />
      )}
    </Box>
  );
}
