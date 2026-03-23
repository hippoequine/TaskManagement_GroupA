import { Box, Input } from '@mui/material';

export default function StoryPoints({ points, onChange }) {
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
      <Input
        variant="standard"
        onChange={onChange}
        value={points ?? '-'}
        disableUnderline={true}
        inputProps={{
          sx: { textAlign: 'center', padding: 0, minWidth: '4ch' },
        }}
        sx={{
          fontWeight: 500,
          color: '#555',
          fontSize: '0.65rem',
          textAlign: 'center',
          type: 'number',
          maxWidth: '4ch',
          // Focused border color
          '&.Mui-focused': {
            backgroundColor: '#e0e0e0', // optional: change background on focus
          },
        }}
      ></Input>
    </Box>
  );
}
