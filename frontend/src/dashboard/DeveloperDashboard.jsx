import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import StatCard from '../components/StatCard';
import GetTodaysDate from '../components/GetTodaysDate';
import NotificationPanel from '../components/NotificationPanel';

/**
 * Displays a sample Workload Table information
 * @param {*} assignee - The person assigned to the task
 * @param {*} work - The description of the task
 * @param {*} datecreated - (YYYY-MM-DD) The date the task was created
 * @param {*} priority - The task's priority level
 * @param {*} status - The task current status
 * @returns {Object} A workload object containing assignee, work, datecreated, priority, and status.
 */
function createSampleData(assignee, work, datecreated, priority, status) {
  return { assignee, work, datecreated, priority, status };
}

const rows = [
  createSampleData(
    'Name #1',
    'Description goes here',
    '2026-01-01',
    'Medium',
    'To-Do'
  ),
  createSampleData(
    'Name #2',
    'Description goes here',
    '2025-12-01',
    'Medium',
    'In Review'
  ),
  createSampleData(
    'Name #3',
    'Description goes here',
    '2025-11-01',
    'Medium',
    'In Review'
  ),
  createSampleData(
    'Name #4',
    'Description goes here',
    '2025-10-01',
    'High',
    'In Progress'
  ),
  createSampleData(
    'Name #5',
    'Description goes here',
    '2025-05-01',
    'Low',
    'Completed'
  ),
];

function DeveloperDashboard() {
  const inputNotifications = [
    { id: 1, message: 'Ticket #1 Cat ipsum dolor sit amet', read: false },
    { id: 2, message: 'Ticket #2 Cat ipsum dolor sit amet', read: false },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              VR Developer Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Box>
            <Button variant="contained" sx={{ mr: 1, mb: 1 }}>
              Tickets
            </Button>
            <Button variant="contained" sx={{ mb: 1 }}>
              Board
            </Button>
          </Box>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="5" title="To-Do" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="2" title="In Review" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="1" title="In Progress" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="1" title="Completed" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {/* Notification Panel */}
          <Box sx={{ width: '49.3%' }}>
            <NotificationPanel inputNotifications={inputNotifications} />
          </Box>

          {/* Recent Activity */}
          <Box
            sx={{
              bgcolor: 'background.default',
              borderRadius: 2,
              boxShadow: 1,
              mb: 2,
              width: '49.3%',
              p: 2,
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Recent Activity
            </Typography>
          </Box>
        </Grid>

        {/* Team Workload Panel */}
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Team Workload
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="My ticket table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assignee</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Work
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Date Created
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Priority
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.assignee}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.assignee}
                    </TableCell>
                    <TableCell align="left">{row.work}</TableCell>
                    <TableCell align="left">{row.datecreated}</TableCell>
                    <TableCell align="left">{row.priority}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default DeveloperDashboard;
