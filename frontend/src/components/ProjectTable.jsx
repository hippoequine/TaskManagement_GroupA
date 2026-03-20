import React from 'react';
import {
  Box,
  Button,
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
import { useProject } from '../context/ProjectContext';

function ProjectTable() {
  const { projects, loading, error } = useProject();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
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

  if (projects.length === 0) {
    return <Typography>No projects found! </Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Key</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Date Created</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.key}</TableCell>
              <TableCell>{p.description}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>
                {p.owner
                  ? `${p.owner.firstName} ${p.owner.lastName}`
                  : 'Unassigned'}
              </TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                {new Date(p.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell size="small">
                <Button>Comment</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProjectTable;
