import { Box, Button, Grid, Typography } from '@mui/material';
import GetTodaysDate from '../components/GetTodaysDate';
import { useNavigate } from 'react-router';
import { BoardProvider } from '../context/BoardContext';
import { IssuesProvider } from '../context/IssuesContext';
import IssueTable from '../components/IssueTable';
import IssuesPieChart from '../components/IssuesPieChart';
import IssuesCompletedStatCard from '../components/IssuesCompletedStatCard';
import IssuesInReviewStatCard from '../components/IssuesInReviewStatCard';
import IssuesInProgressStatCard from '../components/IssuesInProgressStatCard';
import IssuesBacklogStatCard from '../components/IssuesBacklogStatCard';
import ProjectsCompletedStatCard from '../components/ProjectsCompletedStatCard';
import ProjectsPieChart from '../components/ProjectsPieChart';

function DeveloperDashboard() {
  const navigate = useNavigate();

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
              VR Developer Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ mb: 1 }}
              onClick={() => navigate(`/projects`)}
            >
              View Projects
            </Button>
          </Box>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="stretch">
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <ProjectsCompletedStatCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <BoardProvider>
              <IssuesProvider>
                <IssuesBacklogStatCard />
              </IssuesProvider>
            </BoardProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <BoardProvider>
              <IssuesProvider>
                <IssuesInProgressStatCard />
              </IssuesProvider>
            </BoardProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <BoardProvider>
              <IssuesProvider>
                <IssuesInReviewStatCard />
              </IssuesProvider>
            </BoardProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <BoardProvider>
              <IssuesProvider>
                <IssuesCompletedStatCard />
              </IssuesProvider>
            </BoardProvider>
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent={'space-between'}>
          {/* Issue Status */}
          <Box
            sx={{
              bgcolor: 'background.default',
              borderRadius: 2,
              boxShadow: 1,
              mb: 2,
              width: '49%',
              p: 2,
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Issue Status
            </Typography>
            <BoardProvider>
              <IssuesProvider>
                <IssuesPieChart />
              </IssuesProvider>
            </BoardProvider>
          </Box>

          {/* Project Status */}
          <Box
            sx={{
              bgcolor: 'background.default',
              borderRadius: 2,
              boxShadow: 1,
              mb: 2,
              width: '49%',
              p: 2,
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Project Status
            </Typography>
            <BoardProvider>
              <IssuesProvider>
                <ProjectsPieChart />
              </IssuesProvider>
            </BoardProvider>
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
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Team Workload
          </Typography>
          <IssueTable />
        </Box>
      </Box>
    </Box>
  );
}

export default DeveloperDashboard;
