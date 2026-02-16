import { Box, Typography } from '@mui/material';

export default function StoryPoints({ points }) {
  return (
    <Box
      sx={{
        bgcolor: '#f0f0f0',
        px: 0.5,
        py: 0.125,
        borderRadius: 0.5,
        minWidth: 20,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 500, color: '#555', fontSize: '0.65rem' }}
      >
        {points}
      </Typography>
    </Box>
  );
}
