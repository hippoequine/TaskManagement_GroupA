import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { AttachFile, Download } from '@mui/icons-material';

function AttachmentList({ ticketId }) {
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    // Mock data for now
    setAttachments([]);
  }, [ticketId]);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Attachments ({attachments.length})
      </Typography>

      {attachments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No attachments yet
        </Typography>
      ) : (
        <List>
          {attachments.map((file) => (
            <ListItem key={file.id}>
              <ListItemIcon>
                <AttachFile />
              </ListItemIcon>
              <ListItemText
                primary={file.filename}
                secondary={`${(file.size / 1024).toFixed(0)} KB`}
              />
              <IconButton>
                <Download />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default AttachmentList;
