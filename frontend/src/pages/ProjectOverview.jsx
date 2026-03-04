import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Breadcrumbs,
} from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { Link, useOutletContext } from 'react-router';

export default function ProjectOverview() {
  const { project } = useOutletContext();

  return (
    <Box sx={{ p: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          to="/projects"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Projects
        </Link>
        <Typography color="text.primary">{project.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, elevation: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {project.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Key: {project.key || 'N/A'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Dashboard />}
            component={Link}
            to="board"
          >
            Go to Boards
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', lineHeight: 1.6 }}
        >
          {project.description || 'No description provided for this project.'}
        </Typography>
      </Paper>
    </Box>
  );
}
