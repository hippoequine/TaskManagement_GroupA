import { Alert, Box } from '@mui/material';
import { Outlet } from 'react-router';
import { useProject } from '../context/ProjectContext';

export default function Project() {
  const { currentProject: project, loading } = useProject();

  if (loading && !project) {
    return (
      <Box sx={{ opacity: 0.5, transition: 'opacity 0.2s' }}>
        <Outlet />
      </Box>
    );
  }

  if (!project) return <Alert severity="error">Project not found</Alert>;

  return (
    <Box>
      <Outlet context={{ project }} />
    </Box>
  );
}
