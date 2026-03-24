import { Cancel as CancelIcon, Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { projectsApi } from '../api/projectsApi';
import { useProject } from '../context/ProjectContext';

export default function ProjectDetailsPage() {
  const { project } = useOutletContext();
  const { setProjects } = useProject();
  const navigate = useNavigate();

  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key ?? '');
  const [description, setDescription] = useState(project.description ?? '');
  const [category, setCategory] = useState(project.category ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(project.status ?? 'active');

  const handleCancel = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    if (!key.trim()) {
      setError('Project key is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await projectsApi.update(project.id, {
        name: name.trim(),
        key: key.trim(),
        description: description.trim(),
        category: category || null,
        status,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? res.data : p))
      );
      navigate(`/projects/${project.id}`);
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={500}>
            Project Details
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled={saving}
          />
          <TextField
            label="Project Key"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            fullWidth
            disabled={saving}
            inputProps={{ maxLength: 10 }}
            helperText="Short uppercase identifier, e.g. PROJ or APP1"
          />
          <FormControl fullWidth>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              disabled={saving}
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
              disabled={saving}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={5}
            disabled={saving}
          />
        </Box>

        <Box
          sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}
        >
          <Button
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={
              saving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
