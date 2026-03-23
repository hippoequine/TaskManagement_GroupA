import {
  Box,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useUsers } from '../context/UsersContext';
import { useProject } from '../context/ProjectContext';
import { useIssues } from '../context/IssuesContext';
import IssuesPieChart from './IssuesPieChart';

const statusColors = {
  backlog: 'default',
  in_progress: 'primary',
  reviewed: 'warning',
  done: 'success',
  active: 'primary',
  completed: 'success',
  high: 'error',
  medium: 'warning',
  low: 'success',
};

function OverviewPanel() {
  const { users, loading: usersLoading } = useUsers();
  const { projects, loading: projectsLoading } = useProject();
  const { issues, loading: issuesLoading } = useIssues();

  // Get the 3 latest issues
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  // Get the 3 latest users created
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Get the 3 latest projects created
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <Box>
      <Grid container spacing={2} gap={8}>
        {/* ISSUES STATUS CHART */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Issue Status
          </Typography>
          <IssuesPieChart />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {/* NEW ISSUES */}
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Newest Issues
          </Typography>
          <Box sx={{ p: 2, width: '100%' }}>
            {issuesLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Assignee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Date Created
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No issues found!
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentIssues.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.title}</TableCell>
                        <TableCell>
                          {t.assignees?.length
                            ? `${t.assignees[0].firstName} ${t.assignees[0].lastName}`
                            : 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t.status}
                            color={statusColors[t.status] ?? 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={t.priority} size="small" />
                        </TableCell>
                        <TableCell>
                          {t.updatedAt
                            ? new Date(t.updatedAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {/* NEW USERS */}
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Newest Users
          </Typography>
          <Box sx={{ p: 2, width: '100%' }}>
            {usersLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Date Joined
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.fullName}</TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" />
                      </TableCell>
                      <TableCell>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {/* NEW PROJECTS */}
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Newest Projects
          </Typography>
          <Box sx={{ p: 2, width: '100%' }}>
            {projectsLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Date Created
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No projects found!
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentProjects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>
                          {p.owner
                            ? `${p.owner.firstName} ${p.owner.lastName}`
                            : 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.status}
                            color={statusColors[p.status] ?? 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OverviewPanel;
