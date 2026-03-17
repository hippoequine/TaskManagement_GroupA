import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { projectsApi } from '../api/projectsApi';
import { useProject } from '../context/ProjectContext';
import Attachment from '../components/Attachment';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { setProjects } = useProject();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdProjectId, setCreatedProjectId] = useState(null);
  const [status, setStatus] = useState('active');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!key.trim()) {
      setError('Project key is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await projectsApi.create({
        name: name.trim(),
        key: key.trim(),
        description: description.trim(),
        category: category || null,
        status,
      });
      setProjects((prev) => [res.data, ...prev]);
      setCreatedProjectId(res.data.id);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          'Failed to create project. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, px: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 400, color: '#e0e0e0', mb: 4 }}
        >
          Create Project
        </Typography>

        <Paper
          elevation={0}
          sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 4 }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              disabled={submitting}
            />
            <TextField
              label="Project Key"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              required
              fullWidth
              disabled={submitting}
              inputProps={{ maxLength: 10 }}
              helperText="Short uppercase identifier, e.g. PROJ or APP1"
            />
            <FormControl fullWidth>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                disabled={submitting}
              >
                <MenuItem value="">No category</MenuItem>
                <MenuItem value="New Development">New Development</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
                disabled={submitting || !!createdProjectId}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={5}
              disabled={submitting}
            />

            <Attachment projectId={createdProjectId} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => navigate('/projects')}
                disabled={submitting}
              >
                Cancel
              </Button>
              {createdProjectId ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/projects')}
                  sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
                >
                  Done
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
                >
                  {submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Create Project'
                  )}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
