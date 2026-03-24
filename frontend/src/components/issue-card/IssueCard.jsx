import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import {
  Circle as CircleIcon,
  AccountTreeOutlined as NestingIcon,
  VisibilityOutlined as ViewIcon,
} from '@mui/icons-material';
import StoryPoints from './StoryPoints.jsx';
import Assignee from './Assignee.jsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIssues } from '../../context/IssuesContext.jsx';

// Issue type constants
const ISSUE_TYPES = {
  EPIC: 'epic',
  STORY: 'story',
  TASK: 'task',
  BUG: 'bug',
};

// Get icon and color based on issue type
function getIssueTypeIcon(type) {
  switch (type) {
    case ISSUE_TYPES.EPIC:
      return (
        <Tooltip title="Epic" arrow>
          <CircleIcon sx={{ fontSize: 14, color: 'violet' }} />
        </Tooltip>
      );
    case ISSUE_TYPES.STORY:
      return (
        <Tooltip title="Story" arrow>
          <CircleIcon sx={{ fontSize: 14, color: 'lightblue' }} />
        </Tooltip>
      );
    case ISSUE_TYPES.TASK:
      return (
        <Tooltip title="Task" arrow>
          <CircleIcon sx={{ fontSize: 14, color: 'lightgreen' }} />
        </Tooltip>
      );
    case ISSUE_TYPES.BUG:
      return (
        <Tooltip title="Bug" arrow>
          <CircleIcon sx={{ fontSize: 14, color: 'coral' }} />
        </Tooltip>
      );
    default:
      return <CircleIcon sx={{ fontSize: 14, color: '#999' }} />;
  }
}

export default function IssueCard({ issue, isDragging = false, onViewClick }) {
  const { updateIssue } = useIssues();

  let assigneeName = issue.assignee;
  if (
    !assigneeName &&
    Array.isArray(issue.assignees) &&
    issue.assignees.length > 0
  ) {
    const a = issue.assignees[0];
    assigneeName =
      a.fullName ?? `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
  }

  const assigneeId =
    Array.isArray(issue.assignees) && issue.assignees.length > 0
      ? issue.assignees[0].id
      : null;

  const handleStoryPoints = (e) => {
    const points = parseInt(e.target.value, 10);
    if (!isNaN(points) && points >= 0) {
      updateIssue(issue.id, { storyPoints: points });
    }
  };

  const handleAssign = (user) => {
    const assigneeIds = user ? [user.id] : [];
    updateIssue(issue.id, { assigneeIds });
  };

  // Handle view click
  const handleViewClick = (e) => {
    e.stopPropagation();
    if (onViewClick) {
      onViewClick(issue);
    }
  };

  // Sets up sortable w/ issue id for reordering support
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: issue.id,
  });

  // Applies transform and transition styles during drag
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      elevation={0}
      sx={{
        p: 2,
        mb: 1.5,
        bgcolor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        cursor: 'grab',
        opacity: isDragging ? 0.9 : 1,
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Title and View Icon */}
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
          {issue.title}
        </Typography>
        {/* View icon */}
        <IconButton
          size="small"
          sx={{ color: '#ccc', p: 0.25 }}
          onClick={handleViewClick}
        >
          <ViewIcon sx={{ fontSize: 16 }} />
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
        {issue.description}
      </Typography>

      {/* Footer: Issue ID, Story Points, Assignee */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Issue Type Icon and ID */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {getIssueTypeIcon(issue.type)}
          <Typography variant="caption" sx={{ color: '#888' }}>
            {issue.title}
          </Typography>
        </Box>

        {/* Story Points, Nesting Icon, and Assignee */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoryPoints
            points={issue.storyPoints}
            onChange={handleStoryPoints}
            issueId={issue.id}
          />
          {(issue.type === ISSUE_TYPES.EPIC ||
            issue.type === ISSUE_TYPES.STORY) && (
            <NestingIcon sx={{ fontSize: 16, color: '#ccc' }} />
          )}
          <Assignee
            selectedId={assigneeId}
            name={assigneeName}
            onSelect={handleAssign}
          />
        </Box>
      </Box>
    </Paper>
  );
}
