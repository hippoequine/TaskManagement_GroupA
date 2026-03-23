import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import CustomTabPanel from '../components/CustomTabPanel';
import GetTodaysDate from '../components/GetTodaysDate';
import UserTable from '../components/UserTable';
import UsersStatCard from '../components/UsersStatCard';
import ProjectTable from '../components/ProjectTable';
import IssueTable from '../components/IssueTable';
import { IssuesProvider } from '../context/IssuesContext';
import { BoardProvider } from '../context/BoardContext';
import OverviewPanel from '../components/OverviewPanel';
import { ProjectProvider } from '../context/ProjectContext';
import ProjectsStatCard from '../components/ProjectsStatCard';
import IssuesStatCard from '../components/IssuesStatCard';
import ProjectsCompletionRateStatCard from '../components/ProjectsCompletionRateStatCard';
import { ADMIN_CONSOLE_USERS_URL } from '../constants';

/**
 * Function to implement accessible tabs following WAI-ARIA Authoring Practices.
 * @param {number} index the index of the tab
 * @returns ARIA props
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function AdminDashboard() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              Admin Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              window.location.href = ADMIN_CONSOLE_USERS_URL;
            }}
          >
            ADD USERS
          </Button>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="stretch">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <UsersStatCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ProjectsStatCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ProjectProvider>
              <BoardProvider>
                <IssuesProvider>
                  <IssuesStatCard />
                </IssuesProvider>
              </BoardProvider>
            </ProjectProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ProjectsCompletionRateStatCard />
          </Grid>
        </Grid>

        {/* Main Panel */}
        <Box
          sx={{
            bgcolor: 'background.default',
            p: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs for the dashboard"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Users" {...a11yProps(1)} />
            <Tab label="Projects" {...a11yProps(2)} />
            <Tab label="Issues" {...a11yProps(3)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <ProjectProvider>
              <BoardProvider>
                <IssuesProvider>
                  <OverviewPanel />
                </IssuesProvider>
              </BoardProvider>
            </ProjectProvider>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <UserTable />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ProjectProvider>
              <ProjectTable />
            </ProjectProvider>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <BoardProvider>
              <IssuesProvider>
                <IssueTable />
              </IssuesProvider>
            </BoardProvider>
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
