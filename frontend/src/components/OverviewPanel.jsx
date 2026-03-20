import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useUsers } from '../context/UsersContext';
import { useProject } from '../context/ProjectContext';
import { useTasks } from '../context/TasksContext';
import ProjectTable from './ProjectTable';
import TaskTable from './TaskTable';
import UserTable from './UserTable';

const statusColors = {
  backlog: 'default',
  in_progress: 'primary',
  reviewed: 'warning',
  done: 'success',
  active: 'primary',
  completed: 'success',
};

function OverviewPanel() {
  const { users, loading: usersLoading } = useUsers();
  const { projects, loading: projectsLoading } = useProject();
  const { tasks, loading: tasksLoading } = useTasks();
  console.log('user sample:', users[0]);

  // Get the 5 latest tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  // Get the 5 latest users created
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get the 5 latest projects created
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Box>
      {/* NEW USERS */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              New Users
            </Typography>
            {usersLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <UserTable users={recentUsers} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* NEW PROJECTS */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              New Projects
            </Typography>
            {projectsLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <ProjectTable projects={recentProjects} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* NEW TASKS */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              New Tasks
            </Typography>
            {tasksLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <TaskTable tasks={recentTasks} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OverviewPanel;
