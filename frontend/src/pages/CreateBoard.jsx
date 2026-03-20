import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { boardsApi } from '../api/boardsApi';
import { useBoard } from '../context/BoardContext';
import { useProject } from '../context/ProjectContext';

export default function CreateBoard() {
  const navigate = useNavigate();
  const { fetchBoards } = useBoard();
  const { fetchProjects, currentProject } = useProject();

  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdBoardId, setCreatedBoardId] = useState(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Board title is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await boardsApi.create({
        projectId: currentProject.id,
        title: title.trim(),
      });
      const board = res.data;
      fetchBoards();
      fetchProjects();
      setCreatedBoardId(board.id);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          'Failed to create board. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', pt: 6, px: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 400, mb: 4 }}>
          Create Board
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
              label="Board Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
              disabled={submitting}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={() =>
                  navigate(`/projects/${currentProject.id}/boards`)
                }
                disabled={submitting}
              >
                Cancel
              </Button>
              {createdBoardId ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/projects/${currentProject.id}/board/${createdBoardId}`
                    )
                  }
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
                    'Create Board'
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
