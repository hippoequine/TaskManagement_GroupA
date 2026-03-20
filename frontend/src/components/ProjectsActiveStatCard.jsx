import { Card, CardContent, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';

function ProjectsActiveStatCard() {
  const { projects, loading } = useProject();

  const totalProjectsActive = projects.filter(
    (p) => p.status === 'active'
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
          {loading ? 'loading...' : totalProjectsActive}
        </Typography>
        <Typography>Active Projects</Typography>
        <Typography variant="body2">
          {loading ? 'loading...' : `of ${totalProjects} projects`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProjectsActiveStatCard;
