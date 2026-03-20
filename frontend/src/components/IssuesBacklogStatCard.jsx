import { Card, CardContent, Typography } from '@mui/material';
import { useTasks } from '../context/TasksContext';

function IssuesBacklogStatCard() {
  const { tasks, loading } = useTasks();

  const totalIssuesBacklog = tasks.filter((t) => t.status === 'backlog').length;
  const totalIssues = tasks.length;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        width: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {loading ? 'Loading...' : totalIssuesBacklog}
        </Typography>
        <Typography>Backlog Issues</Typography>
        <Typography variant="body2">
          {loading ? 'Loading...' : `of ${totalIssues} issues`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IssuesBacklogStatCard;
