import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A sample Notification Panel that displays the notification list and allows user to mark it as read or unread.
 * @param {Array<Object>} inputNotifications - The list of notification to display
 * @returns displays a panel of the notifications
 */
function NotificationPanel({ inputNotifications }) {
  const [notifications, setNotifications] = useState(inputNotifications);

  /**
   * Toggle the notifications as read or unread
   * @param {number} id - the ID of the notification to toggle
   */
  const toggleRead = (id) => {
    const updatedNotifications = notifications.map((notif) => {
      if (notif.id === id) {
        return { ...notif, read: !notif.read };
      }
      return notif;
    });

    setNotifications(updatedNotifications);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        mb: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        Notifications
      </Typography>
      <Stack spacing={1}>
        {notifications.map((notif) => (
          <Paper
            key={notif.id}
            sx={{ p: 2, display: 'flex', alignItems: 'flex-start' }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={notif.read}
                  onChange={() => toggleRead(notif.id)}
                />
              }
              label={<Typography>{notif.message}</Typography>}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

NotificationPanel.propTypes = {
  inputNotifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default NotificationPanel;
