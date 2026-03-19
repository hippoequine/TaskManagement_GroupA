import './App.css';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import useAuth from './auth/useAuth.js';
import AdminDashboard from './dashboard/AdminDashboard.jsx';
import ClinicianDashboard from './dashboard/ClinicianDashboard.jsx';
import DeveloperDashboard from './dashboard/DeveloperDashboard.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

function App() {
  const { isAuthenticated, logout, isLoading, roles } = useAuth();

  //Shows a spinner while AuthProvider is fetching the user profile
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const displayDashboard = () => {
    if (!roles || roles.length === 0) {
      return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <CircularProgress size={18} />
          <Typography>Loading roles...</Typography>
        </Box>
      );
    }

    if (roles.includes('admin')) {
      return <AdminDashboard />;
    }
    if (roles.includes('clinician')) {
      return <ClinicianDashboard />;
    }
    if (roles.includes('developer')) {
      return <DeveloperDashboard />;
    }

    // user is authenticated but does not have valid roles
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          You do not have permission to access any of the dashboards!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    );
  };

  return (
    <div style={{ height: '100vh' }}>
      {isAuthenticated ? displayDashboard() : <Unauthorized />}
    </div>
  );
}

export default App;
