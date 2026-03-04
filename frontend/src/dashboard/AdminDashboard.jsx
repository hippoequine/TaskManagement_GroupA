import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import StatCard from '../components/StatCard';
import CustomTabPanel from '../components/CustomTabPanel';
import GetTodaysDate from '../components/GetTodaysDate';
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
              Admin Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Button variant="contained">+ Add User</Button>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              value="50"
              title="Total Users"
              subtitle="10 Clinician, 40 Developers"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              value="200"
              title="Total Tickets"
              subtitle="150 Active, 50 Completed"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="90%" title="Rate" subtitle="Last 30 days" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="90%" title="Rate" subtitle="Last 30 days" />
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
            <Tab label="User Management" {...a11yProps(1)} />
            <Tab label="System Management" {...a11yProps(2)} />
            <Tab label="All Tickets" {...a11yProps(3)} />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            Overview information will go here
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            User Management information will go here
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            System Management information will go here
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            All Tickets information will go here
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
