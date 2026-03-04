import { Tooltip, IconButton } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export default function Assignee({ name }) {
  return (
    <Tooltip title={name || 'Unassigned'} arrow>
      <IconButton size="small" sx={{ color: '#ccc', p: 0.25 }}>
        <PersonIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
