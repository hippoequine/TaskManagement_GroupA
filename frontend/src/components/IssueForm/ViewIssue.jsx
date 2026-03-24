import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import CreateIssueForm from './CreateIssueForm';
import PropTypes from 'prop-types';

// Status display config
const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: '#9e9e9e' },
  in_progress: { label: 'In Progress', color: '#2196f3' },
  reviewed: { label: 'In Review', color: '#ff9800' },
  done: { label: 'Done', color: '#4caf50' },
};

// Issue type color config
const TYPE_COLORS = {
  epic: 'violet',
  story: 'lightblue',
  task: 'lightgreen',
  bug: 'coral',
};

function ViewIssue({ issue, onClose, onDelete, onEditSuccess }) {
  const [isEditing, setIsEditing] = useState(false);

  // Get status display info
  const statusInfo = STATUS_CONFIG[issue.status] || {
    label: issue.status,
    color: '#9e9e9e',
  };

  // Get type color
  const typeColor = TYPE_COLORS[issue.type] || '#999';

  if (isEditing) {
    return (
      <CreateIssueForm
        mode="edit"
        issueId={issue.id}
        initialData={issue}
        onIssueCreation={() => {
          if (onEditSuccess) onEditSuccess();
        }}
      />
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Header with title and actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Type indicator and title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CircleIcon sx={{ fontSize: 14, color: typeColor }} />
            <Typography
              variant="caption"
              sx={{ color: '#666', textTransform: 'capitalize' }}
            >
              {issue.type}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {issue.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onDelete && (
            <Button variant="outlined" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </Box>
      </Box>

      {/* Status indicator */}
      <Box sx={{ mb: 3 }}>
        <Chip
          label={statusInfo.label}
          sx={{
            bgcolor: statusInfo.color,
            color: 'white',
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Issue details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Description */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
            Description
          </Typography>
          <Typography variant="body1">
            {issue.description || 'No description provided.'}
          </Typography>
        </Box>

        {/* Details grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            mt: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
              Priority
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {issue.priority || 'Not set'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
              Story Points
            </Typography>
            <Typography variant="body1">
              {issue.storyPoints ?? 'Not set'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
              Reporter
            </Typography>
            <Typography variant="body1">
              {issue.reporter?.name ||
                issue.reporter?.fullName ||
                `${issue.reporter?.firstName || ''} ${issue.reporter?.lastName || ''}`.trim() ||
                'None'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
              Due Date
            </Typography>
            <Typography variant="body1">
              {issue.dueDate
                ? new Date(issue.dueDate).toLocaleDateString()
                : 'Not set'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
              Assignee
            </Typography>
            <Typography variant="body1">
              {issue.assignees && issue.assignees.length > 0
                ? issue.assignees
                    .map(
                      (a) =>
                        a.fullName ||
                        `${a.firstName || ''} ${a.lastName || ''}`.trim()
                    )
                    .join(', ')
                : 'Unassigned'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

ViewIssue.propTypes = {
  issue: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onEditSuccess: PropTypes.func,
};

export default ViewIssue;
