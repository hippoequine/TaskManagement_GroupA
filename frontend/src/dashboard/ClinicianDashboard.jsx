import { Box, Button, Grid, Typography } from '@mui/material';
import NotificationPanel from '../components/NotificationPanel';
import GetTodaysDate from '../components/GetTodaysDate';
import ProjectsStatCard from '../components/ProjectsStatCard';
import ProjectTable from '../components/ProjectTable';
import { useNavigate } from 'react-router';
import ProjectsCompletedStatCard from '../components/ProjectsCompletedStatCard';
import ProjectsActiveStatCard from '../components/ProjectsActiveStatCard';
import ProjectsCompletionRateStatCard from '../components/ProjectsCompletionRateStatCard';

function ClinicianDashboard() {
  const navigate = useNavigate();
  const inputNotifications = [
    { id: 1, message: 'Project #1 Cat ipsum dolor sit amet', read: false },
    { id: 2, message: 'Project #2 Cat ipsum dolor sit amet', read: false },
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
              Clinician Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/projects/create')}
          >
            + Create Project
          </Button>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectsStatCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectsActiveStatCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectsCompletedStatCard />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectsCompletionRateStatCard />
          </Grid>
        </Grid>

        {/* Notification Panel */}
        <NotificationPanel inputNotifications={inputNotifications} />

        {/* Main Panel */}
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            My Projects
          </Typography>
          <ProjectTable />
        </Box>
      </Box>
    </Box>
  );
}

export default ClinicianDashboard;
