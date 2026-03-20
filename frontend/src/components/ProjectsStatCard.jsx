import { Card, CardContent, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';

function ProjectsStatCard() {
  const { projects, loading } = useProject();

  const totalActiveProjects = projects.filter(
    (p) => p.status === 'active'
  ).length;
  const totalCompletedProjects = projects.filter(
    (p) => p.status === 'completed'
  ).length;
  const totalProjects = projects.length;

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
          {loading ? 'loading...' : totalProjects}
        </Typography>
        <Typography>Total Projects</Typography>
        <Typography variant="body2">
          {totalActiveProjects} active, {totalCompletedProjects} completed
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProjectsStatCard;
