import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import {
  EditOutlined as EditIcon,
  Circle as CircleIcon,
  Pentagon as PentagonIcon,
  AccountTreeOutlined as NestingIcon,
} from '@mui/icons-material';
import StoryPoints from './StoryPoints.jsx';
import Assignee from './Assignee.jsx';

// Task type constants
const TASK_TYPES = {
  EPIC: 'epic',
  STORY: 'story',
  SUBTASK: 'subtask',
};

// Custom rhombus icon for subtasks
function RhombusIcon({ sx }) {
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        bgcolor: '#F5A623',
        transform: 'rotate(45deg)',
        ...sx,
      }}
    />
  );
}

// Get icon and color based on task type
function getTaskTypeIcon(type) {
  switch (type) {
    case TASK_TYPES.EPIC:
      return (
        <Tooltip title="Epic" arrow>
          <CircleIcon sx={{ fontSize: 14, color: '#E91E8C' }} />
        </Tooltip>
      );
    case TASK_TYPES.STORY:
      return (
        <Tooltip title="Story" arrow>
          <PentagonIcon sx={{ fontSize: 14, color: '#00B8D9' }} />
        </Tooltip>
      );
    case TASK_TYPES.SUBTASK:
      return (
        <Tooltip title="Sub-task" arrow>
          <Box component="span" sx={{ display: 'inline-flex' }}>
            <RhombusIcon />
          </Box>
        </Tooltip>
      );
    default:
      return <CircleIcon sx={{ fontSize: 14, color: '#999' }} />;
  }
}

export default function TaskCard({ task }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Title and Edit Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, color: '#333', pr: 1 }}
        >
          {task.title}
        </Typography>
        <IconButton size="small" sx={{ color: '#ccc', p: 0.25 }}>
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        component="p"
        sx={{
          color: '#666',
          fontSize: '0.8rem',
          lineHeight: 1.4,
          mb: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          paddingLeft: '0 !important',
          marginLeft: '0 !important',
          textIndent: '0 !important',
          textAlign: 'left',
        }}
      >
        {task.description}
      </Typography>

      {/* Footer: Task ID, Story Points, Assignee */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Task Type Icon and ID */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {getTaskTypeIcon(task.type)}
          <Typography variant="caption" sx={{ color: '#888' }}>
            {task.id}
          </Typography>
        </Box>

        {/* Story Points, Nesting Icon, and Assignee */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoryPoints points={task.storyPoints} taskId={task.id} />
          {(task.type === TASK_TYPES.EPIC ||
            task.type === TASK_TYPES.STORY) && (
            <NestingIcon sx={{ fontSize: 16, color: '#ccc' }} />
          )}
          <Assignee name={task.assignee} />
        </Box>
      </Box>
    </Paper>
  );
}
