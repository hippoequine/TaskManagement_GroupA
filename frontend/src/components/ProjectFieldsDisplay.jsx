import { Box, Typography } from '@mui/material';

function ProjectField({ label, value, multiline = false }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          lineHeight: multiline ? 1.5 : 'inherit',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function ProjectFieldsDisplay({ project }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <ProjectField label="Project Name" value={project.name || 'N/A'} />
      <ProjectField label="Project Key" value={project.key || 'N/A'} />
      <ProjectField
        label="Category"
        value={project.category || 'No category'}
      />
      <ProjectField
        label="Status"
        value={project.status === 'completed' ? 'Completed' : 'Active'}
      />
      <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / -1' } }}>
        <ProjectField
          label="Description"
          value={
            project.description || 'No description provided for this project.'
          }
          multiline
        />
      </Box>
    </Box>
  );
}
