import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  IconButton,
  Popover,
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useUsers } from '../../context/UsersContext';

function getDisplayNameFromUser(u) {
  if (!u) return '';
  if (u.fullName) return u.fullName;
  return `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
}

function initialsFromName(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

export default function Assignee({ name, selectedId = null, onSelect }) {
  const { users, loading } = useUsers();
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setQuery('');
  };
  const handleClose = () => {
    setAnchorEl(null);
    setQuery('');
  };

  const avatarSize = 22;

  const filtered = useMemo(() => {
    if (!users || users.length === 0) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const full =
        `${u.fullName ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()} ${u.email ?? ''}`.toLowerCase();
      return full.includes(q);
    });
  }, [users, query]);

  const handleSelect = (user) => {
    if (onSelect) onSelect(user);
    handleClose();
  };

  const handleUnassign = () => {
    if (onSelect) onSelect(null);
    handleClose();
  };

  return (
    <>
      <Tooltip title={name || 'Unassigned'} arrow>
        <IconButton
          size="small"
          sx={{
            color: '#ccc',
            p: 0.25,
            minWidth: avatarSize + 8,
            width: avatarSize + 8,
            height: avatarSize + 8,
          }}
          onClick={handleOpen}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="Assign user"
        >
          <Avatar
            sx={{
              width: avatarSize,
              height: avatarSize,
              fontSize: 12,
              bgcolor: name ? 'primary.main' : 'transparent',
              color: name ? 'primary.contrastText' : 'text.secondary',
            }}
          >
            {name ? (
              initialsFromName(name)
            ) : (
              <PersonIcon sx={{ fontSize: avatarSize - 6 }} />
            )}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { width: 300, p: 1 } }}
      >
        <Box sx={{ px: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment: query ? (
                <IconButton
                  size="small"
                  onClick={() => setQuery('')}
                  aria-label="Clear"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null,
            }}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <List dense disablePadding>
            {selectedId !== null && (
              <MenuItem
                onClick={handleUnassign}
                selected={selectedId === null}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: 'transparent',
                        color: 'text.secondary',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2">Unassign</Typography>}
                    secondary={
                      <Typography variant="caption">
                        Remove current assignee
                      </Typography>
                    }
                  />
                </Box>
                {selectedId === null && <CheckIcon color="primary" />}
              </MenuItem>
            )}

            <Divider sx={{ my: 0.5 }} />

            {loading && (
              <ListItemButton disabled>
                <ListItemText primary="Loading users..." />
              </ListItemButton>
            )}

            {!loading && filtered.length === 0 && (
              <ListItemButton disabled>
                <ListItemText primary="No users found" />
              </ListItemButton>
            )}

            {!loading &&
              filtered.map((u) => {
                const fullName = getDisplayNameFromUser(u);
                const isSelected = selectedId === u.id;
                return (
                  <ListItemButton
                    key={u.id}
                    onClick={() => handleSelect(u)}
                    selected={isSelected}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 30, height: 30 }}>
                          {initialsFromName(fullName) || (
                            <PersonIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">{fullName}</Typography>
                        }
                        secondary={
                          <Typography variant="caption">
                            {u.email ?? u.role}
                          </Typography>
                        }
                      />
                    </Box>
                    {isSelected && <CheckIcon color="primary" />}
                  </ListItemButton>
                );
              })}
          </List>
        </Box>
      </Popover>
    </>
  );
}

Assignee.propTypes = {
  name: PropTypes.string,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func,
};
