import { Alert, Box, LinearProgress } from '@mui/material';
import { Outlet } from 'react-router';
import { useProject } from '../context/ProjectContext';

export default function ProjectLayout() {
  const { projects, loading, error } = useProject();

  if (error && projects.length === 0)
    return <Alert severity="error">{error}</Alert>;

  const isInitialLoad = loading && projects.length === 0;

  return (
    <Box sx={{ position: 'relative' }}>
      {isInitialLoad ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            height: 2,
          }}
        />
      ) : (
        <Outlet />
      )}
    </Box>
  );
}
