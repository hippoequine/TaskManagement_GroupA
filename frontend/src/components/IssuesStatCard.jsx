import { Card, CardContent, Typography } from '@mui/material';
import { useAllIssues } from '../context/IssuesContext';

function IssuesStatCard() {
  const { issues, loading } = useAllIssues();

  const totalBacklog = issues.filter((t) => t.status === 'backlog').length;
  const totalInProgress = issues.filter(
    (t) => t.status === 'in_progress'
  ).length;
  const totalInReview = issues.filter((t) => t.status === 'reviewed').length;
  const totalDone = issues.filter((t) => t.status === 'done').length;
  const totalTasks = issues.length;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 2,
        width: '100%',
        height: '100%',
      }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Typography variant="h5" fontWeight="bold">
          {loading ? 'Loading...' : totalTasks}
        </Typography>
        <Typography>Total Issues</Typography>
        <Typography variant="body2">
          {totalBacklog} Backlog, {totalInProgress} In Progress, {totalInReview}{' '}
          Reviewed, {totalDone} Done
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IssuesStatCard;
