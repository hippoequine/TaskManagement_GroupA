import { useState } from 'react';
import { Box, Button, Grid, Typography, Modal } from '@mui/material';
import StatCard from '../components/StatCard';
import GetTodaysDate from '../components/GetTodaysDate';
import NotificationPanel from '../components/NotificationPanel';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm'; // ADDED
import ViewIssue from '../components/IssueForm/ViewIssue'; // ADDED
import { BoardProvider } from '../context/BoardContext';
import { TasksProvider } from '../context/TasksContext';
import TaskTable from '../components/TaskTable';

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

      <Box sx={{ py: 3, margin: '2em' }}>
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
            <Typography variant="h5" fontWeight="bold" mb={2}>
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
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Team Workload
          </Typography>
          <BoardProvider>
            <TasksProvider>
              <TaskTable />
            </TasksProvider>
          </BoardProvider>
        </Box>
      </Box>
    </Box>
  );
}

export default DeveloperDashboard;
