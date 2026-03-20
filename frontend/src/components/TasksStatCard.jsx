import { Card, CardContent, Typography } from '@mui/material';
import { useTasks } from '../context/TasksContext';

function TasksStatCard() {
  const { tasks, loading } = useTasks();

  const totalBacklog = tasks.filter((t) => t.status === 'backlog').length;
  const totalInProgress = tasks.filter(
    (t) => t.status === 'in_progress'
  ).length;
  const totalInReview = tasks.filter((t) => t.status === 'reviewed').length;
  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;

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
          {loading ? 'Loading...' : totalTasks}
        </Typography>
        <Typography>Total Tasks</Typography>
        <Typography variant="body2">
          {totalBacklog} Backlog, {totalInProgress} In Progress, {totalInReview}{' '}
          In Review, {totalDone} Completed
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TasksStatCard;
