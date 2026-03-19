import {
  Add as AddIcon,
  Search as SearchIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBoard } from '../context/BoardContext';
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

// ─── Starred IDs (localStorage, per-browser) ─────────────────────────────────

const STARRED_KEY = 'jiro:starredBoards';

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BoardsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  // Read from contexts
  const { boards, loading, error } = useBoard();
  const { currentProject: project } = useProject();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Starred state (localStorage only — starring is a personal preference)
  const [starredIds, setStarredIds] = useState(loadStarred);

  // ── Star toggle ──
  const handleToggleStar = (boardId) => {
    setStarredIds((prev) => {
      const updated = prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId];
      saveStarred(updated);
      return updated;
    });
  };

  // ── Filtering ──
  const filteredBoards = (boards || []).filter((board) => {
    const title = (board.title || board.name || '').toString();
    const matchesSearch = title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box>
      <Box sx={{ maxWidth: 1400, mx: 'auto', pt: 4, px: 3 }}>
        {/* Page Title and Create Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 400 }}>
            Boards
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/projects/${projectId}/board/create`)}
            sx={{
              bgcolor: '#333',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 500,
              px: 2.5,
              '&:hover': { bgcolor: '#444' },
            }}
          >
            Create Board
          </Button>
        </Box>

        {/* Error banner (from context) */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Boards Table Card */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden',
          }}
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
              placeholder={`Search boards${project?.name ? ` in ${project.name}` : ''}...`}
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
          </Box>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : filteredBoards.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">
                {boards.length === 0
                  ? 'No boards yet. Create your first one!'
                  : 'No boards match your search.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ width: 50 }} />
                    {['Name', 'ID', 'Created'].map((col) => (
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
                  {filteredBoards.map((board) => {
                    const isStarred = starredIds.includes(board.id);
                    return (
                      <TableRow
                        key={board.id}
                        onClick={() =>
                          navigate(`/projects/${projectId}/board/${board.id}`)
                        }
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
                              handleToggleStar(board.id);
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
                          {board.title ?? board.name ?? `Board ${board.id}`}
                        </TableCell>

                        {/* ID */}
                        <TableCell>
                          <Chip
                            label={board.id ?? '—'}
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

                        {/* Created */}
                        <TableCell sx={{ color: '#888', fontStyle: 'italic' }}>
                          {timeAgo(board.createdAt)}
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
    </Box>
  );
}
