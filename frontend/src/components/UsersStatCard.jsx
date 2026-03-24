import { Card, CardContent, Typography } from '@mui/material';
import { useUsers } from '../context/UsersContext';

/**
 * A stat card that displays metrics for users
 * @returns users metrics
 */
function UsersStatCard() {
  const { users, loading } = useUsers();

  const totalDevelopers = users.filter((u) => u.role === 'developer').length;
  const totalClinicians = users.filter((u) => u.role === 'clinician').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalUsers = users.length;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        width: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {loading ? 'Loading...' : totalUsers}
        </Typography>
        <Typography>Total Users</Typography>
        <Typography variant="body2">
          {totalClinicians} Clinician(s), {totalDevelopers} Developer(s),{' '}
          {totalAdmins} Admin(s)
        </Typography>
      </CardContent>
    </Card>
  );
}

export default UsersStatCard;
