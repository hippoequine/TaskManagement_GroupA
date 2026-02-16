import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { projectsApi } from '../api/projectsApi';
import { useProject } from '../context/ProjectContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const seconds = Math.floor((Date.now() - date) / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

function getInitials(str = '') {
  return str
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Starred IDs (localStorage, per-browser) ─────────────────────────────────

const STARRED_KEY = 'jiro:starredProjects';

function loadStarred() {
  try {
    return JSON.parse(localStorage.getItem(STARRED_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStarred(ids) {
  localStorage.setItem(STARRED_KEY, JSON.stringify(ids));
}

// ─── Create Project Dialog ────────────────────────────────────────────────────

function CreateProjectDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      await onCreate({
        name: name.trim(),
        key: key.trim(),
        description: description.trim(),
        category: category || null,
      });
      setName('');
      setKey('');
      setDescription('');
      setCategory('');
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error || 'Failed to create project. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setName('');
    setKey('');
    setDescription('');
    setCategory('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 500 }}>Create Project</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
      >
        {error && <Alert severity="error">{error}</Alert>}
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
        <FormControl fullWidth size="small">
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
        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          disabled={submitting}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}
        >
          {submitting ? <CircularProgress size={20} color="inherit" /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const navigate = useNavigate();

  // Read from context — ProjectContext already fetches on mount, no duplicate call needed
  const { projects, setProjects, loading, error } = useProject();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Starred state (localStorage only — starring is a personal preference)
  const [starredIds, setStarredIds] = useState(loadStarred);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);

  // ── Star toggle ──
  const handleToggleStar = (projectId) => {
    setStarredIds((prev) => {
      const updated = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      saveStarred(updated);
      return updated;
    });
  };

  // ── Create project ──
  const handleCreateProject = async (payload) => {
    const res = await projectsApi.create(payload);
    // Prepend to context so it appears immediately at the top of the list
    setProjects((prev) => [res.data, ...prev]);
  };

  // ── Filtering ──
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, px: 3 }}>
        {/* Page Title and Create Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 400, color: '#333' }}>
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{
              bgcolor: '#333',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 500,
              px: 2.5,
              '&:hover': { bgcolor: '#444' },
            }}
          >
            Create Project
          </Button>
        </Box>

        {/* Error banner (from context) */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Projects Table Card */}
        <Paper
          elevation={0}
          sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}
        >
          {/* Search and Filter Row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TextField
              placeholder="Search projects..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': { bgcolor: 'white' },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#999' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Category:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="New Development">New Development</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : filteredProjects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">
                {projects.length === 0
                  ? 'No projects yet. Create your first one!'
                  : 'No projects match your search.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ width: 50 }} />
                    {['Name', 'Key', 'Category', 'Owner', 'Created'].map((col) => (
                      <TableCell
                        key={col}
                        sx={{
                          fontWeight: 500,
                          color: '#666',
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: 0.5,
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const isStarred = starredIds.includes(project.id);
                    return (
                      <TableRow
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f9f9f9' },
                          '& td': { borderBottom: '1px solid #eee' },
                        }}
                      >
                        {/* Star */}
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStar(project.id);
                            }}
                            sx={{ color: isStarred ? '#f5c518' : '#ccc' }}
                          >
                            {isStarred ? (
                              <StarIcon fontSize="small" />
                            ) : (
                              <StarBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>

                        {/* Name */}
                        <TableCell sx={{ fontWeight: 500, color: '#333' }}>
                          {project.name}
                        </TableCell>

                        {/* Key */}
                        <TableCell>
                          <Chip
                            label={project.key ?? '—'}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: '#ddd',
                              bgcolor: 'white',
                              fontSize: '0.75rem',
                              height: 24,
                              fontFamily: 'monospace',
                            }}
                          />
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          {project.category ? (
                            <Chip
                              label={project.category}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: '#ddd',
                                bgcolor: 'white',
                                fontSize: '0.75rem',
                                height: 24,
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Owner */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: '#e0e0e0',
                                color: '#555',
                                fontSize: '0.65rem',
                              }}
                            >
                              {getInitials(project.owner_id ?? '')}
                            </Avatar>
                            <Typography variant="body2" color="text.primary">
                              {project.owner_id}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Created */}
                        <TableCell sx={{ color: '#888', fontStyle: 'italic' }}>
                          {timeAgo(project.created_at)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateProject}
      />
    </Box>
  );
}