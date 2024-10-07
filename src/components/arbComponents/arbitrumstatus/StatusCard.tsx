import { Box, Typography } from '@mui/material';
import { ComponentStatus } from './types';

interface StatusCardProps {
  title: string;
  value: string;
  description: string;
  status: ComponentStatus;
}

function StatusCard({
  title,
  value,
  description = '',
  status,
}: StatusCardProps) {
  function getStatusColor(componentStatus: ComponentStatus): string {
    switch (componentStatus) {
      case ComponentStatus.OPERATIONAL:
        return 'green';
      case ComponentStatus.PARTIALOUTAGE:
        return 'orange';
      case ComponentStatus.MINOROUTAGE:
        return 'yellow';
      case ComponentStatus.MAJOROUTAGE:
        return 'red';
      default:
        return 'gray';
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        minWidth: '100%',
        height: '150px',
        margin: '8px',
        border: `2px solid ${getStatusColor(status)}`,
        flexShrink: 0,
      }}
    >
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', margin: '8px 0' }}>
        {value}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
  );
}

export default StatusCard;
