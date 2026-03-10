import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import CreateIssueForm from './CreateIssueForm';
import PropTypes from 'prop-types';

function ViewIssue({ issue, onClose, onEditSuccess }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CreateIssueForm
        mode="edit"
        issueId={issue.id}
        initialData={issue}
        onIssueCreation={(shouldClose) => {
          setIsEditing(false);
          if (onEditSuccess) onEditSuccess();
          if (shouldClose === false) onClose(); // close view after edit
        }}
      />
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{issue.title}</Typography>
        <Box>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{ ml: 1 }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography>
          <strong>Type:</strong> {issue.issueType || issue.type}
        </Typography>
        <Typography>
          <strong>Project:</strong> {issue.project?.name || 'None'}
        </Typography>
        <Typography>
          <strong>Description:</strong> {issue.description}
        </Typography>
        <Typography>
          <strong>Reporter:</strong> {issue.reporter?.name || 'None'}
        </Typography>
        <Typography>
          <strong>Priority:</strong> {issue.priority}
        </Typography>
        <Typography>
          <strong>Story Points:</strong> {issue.storyPoints}
        </Typography>
        <Typography>
          <strong>Due Date:</strong>{' '}
          {issue.dueDate
            ? new Date(issue.dueDate).toLocaleDateString()
            : 'None'}
        </Typography>
      </Box>
    </Paper>
  );
}

ViewIssue.propTypes = {
  issue: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEditSuccess: PropTypes.func,
};

export default ViewIssue;
