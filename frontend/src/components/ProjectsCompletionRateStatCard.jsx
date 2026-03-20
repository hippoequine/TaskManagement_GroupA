import { Card, CardContent, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';

function ProjectsCompletionRateStatCard() {
  const { projects, loading } = useProject();

  const totalProjectsCompleted = projects.filter(
    (p) => p.status === 'completed'
  ).length;
  const completionRate =
    projects.length > 0
      ? ((totalProjectsCompleted / projects.length) * 100).toFixed(0)
      : '0';

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
          {loading ? 'loading...' : completionRate}%
        </Typography>
        <Typography>Completion Rate</Typography>
        <Typography variant="body2">
          {totalProjectsCompleted} of {projects.length} projects completed
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProjectsCompletionRateStatCard;
