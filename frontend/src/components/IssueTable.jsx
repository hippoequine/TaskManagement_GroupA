import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAllIssues } from '../context/IssuesContext';

const statusColors = {
  backlog: 'default',
  in_progress: 'primary',
  reviewed: 'secondary',
  done: 'success',
};

function IssueTable() {
  const { issues, loading, error } = useAllIssues();

  if (loading) {
    return (
      <Box dislay="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Assignee</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No issues found.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>
                  <Chip
                    label={t.status}
                    color={statusColors[t.status] ?? 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{t.assignee?.fullName || 'Unassigned'}</TableCell>
                <TableCell>{t.dueDate || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IssueTable;
