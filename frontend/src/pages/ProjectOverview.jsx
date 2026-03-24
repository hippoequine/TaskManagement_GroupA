import { Dashboard, Settings } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Divider, Typography } from '@mui/material';
import { Link, useOutletContext } from 'react-router';
import Attachment from '../components/Attachment';
import ProjectFieldsDisplay from '../components/ProjectFieldsDisplay';

export default function ProjectOverview() {
  const { project } = useOutletContext();

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography variant="h5">{project.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Key: {project.key || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={project.status === 'completed' ? 'Completed' : 'Active'}
                size="small"
                sx={{
                  bgcolor:
                    project.status === 'completed' ? '#e8f5e9' : '#e3f2fd',
                  color: project.status === 'completed' ? '#2e7d32' : '#1565c0',
                  fontWeight: 500,
                }}
              />
              {project.owner && (
                <>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.65rem',
                      bgcolor: '#e0e0e0',
                      color: '#555',
                    }}
                  >
                    {`${project.owner.firstName?.[0] ?? ''}${project.owner.lastName?.[0] ?? ''}`.toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {project.owner.firstName} {project.owner.lastName}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              component={Link}
              to="details"
              size="small"
            >
              Edit Details
            </Button>
            <Button
              variant="contained"
              startIcon={<Dashboard />}
              component={Link}
              to="board"
              size="small"
            >
              Go to Boards
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <ProjectFieldsDisplay project={project} />

        <Divider sx={{ my: 2 }} />

        <Attachment projectId={project.id} />
      </Box>
    </Box>
  );
}
