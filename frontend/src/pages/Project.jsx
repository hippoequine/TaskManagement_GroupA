import { Alert, Box } from '@mui/material';
import { Outlet, useParams } from 'react-router';
import { useProject } from '../context/ProjectContext';
import { useMemo } from 'react';

export default function Project() {
  const { projectId } = useParams();
  const { projects, loading } = useProject();

  const project = useMemo(
    () => projects.find((p) => String(p.id) === String(projectId)),
    [projects, projectId]
  );

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
