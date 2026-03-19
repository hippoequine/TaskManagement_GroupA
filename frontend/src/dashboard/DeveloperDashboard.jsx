import { useState } from 'react';
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
  Modal,
} from '@mui/material';
import StatCard from '../components/StatCard';
import GetTodaysDate from '../components/GetTodaysDate';
import NotificationPanel from '../components/NotificationPanel';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm'; // ADDED
import ViewIssue from '../components/IssueForm/ViewIssue'; // ADDED

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
  // ADDED STATE
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // UPDATED notification messages (changed "Ticket" to "Issue")
  const inputNotifications = [
    { id: 1, message: 'Issue #1 Cat ipsum dolor sit amet', read: false },
    { id: 2, message: 'Issue #2 Cat ipsum dolor sit amet', read: false },
  ];

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        height: '100%',
        maxWidth: 1400,
        mx: 'auto',
      }}
    >
      {/* ADDED MODALS */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <CreateIssueForm
            mode="create"
            onIssueCreation={() => setOpenCreateModal(false)}
          />
        </Box>
      </Modal>

      <Modal open={!!selectedIssue} onClose={() => setSelectedIssue(null)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedIssue && (
            <ViewIssue
              issue={selectedIssue}
              onClose={() => setSelectedIssue(null)}
            />
          )}
        </Box>
      </Modal>

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
            {/* UPDATED button text and added onClick */}
            <Button
              variant="contained"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => setOpenCreateModal(true)}
            >
              Issues
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
            <Table aria-label="My issue table">
              {' '}
              {/* label */}
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
                    onClick={() => {
                      // ADDED: Convert sample data to issue format and open view modal
                      setSelectedIssue({
                        id: row.assignee,
                        title: row.work,
                        description: row.work,
                        issueType: 'Task',
                        project: { id: 1, name: 'Sample Project' },
                        reporter: { id: 1, name: row.assignee },
                        priority: row.priority,
                        storyPoints: 1,
                        dueDate: row.datecreated,
                        status: row.status,
                      });
                    }}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer', // ADDED
                      '&:hover': { bgcolor: 'action.hover' }, // ADDED
                    }}
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
