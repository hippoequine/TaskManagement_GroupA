import './App.css';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import useAuth from './auth/useAuth.js';
import AdminDashboard from './dashboard/AdminDashboard.jsx';
import ClinicianDashboard from './dashboard/ClinicianDashboard.jsx';
import DeveloperDashboard from './dashboard/DeveloperDashboard.jsx';

function App() {
  const { user, isAuthenticated, login, logout, isLoading, roles } = useAuth();

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
    <div>
      {isAuthenticated ? (
        <Box>
          <Typography variant="body1">
            Welcome, <strong>{user?.name || 'User'}</strong>!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Roles: {roles.length > 0 ? roles.join(', ') : 'No roles assigned'}
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
      ) : (
        <Box>
          <Typography variant="body1" gutterBottom>
            Please log in to continue.
          </Typography>
          <Button variant="contained" color="primary" onClick={login}>
            Login
          </Button>
        </Box>
      )}

      {isAuthenticated && displayDashboard()}
    </div>
  );
}

export default App;
