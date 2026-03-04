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
import NotificationPanel from '../components/NotificationPanel';
import GetTodaysDate from '../components/GetTodaysDate';

/**
 * Displays a Sample Ticket table information
 * @param {*} ticketID
 * @param {*} description
 * @param {*} date
 * @param {*} status
 * @param {*} comment
 * @returns
 */
function createSampleData(ticketID, description, datecreated, status, comment) {
  return { ticketID, description, datecreated, status, comment };
}

const rows = [
  createSampleData(
    'Ticket #1',
    'Description goes here',
    '2026-01-01',
    'Submitted',
    <Button>Leave Comment</Button>
  ),
  createSampleData(
    'Ticket #2',
    'Description goes here',
    '2025-12-01',
    'In Review',
    <Button>Leave Comment</Button>
  ),
  createSampleData(
    'Ticket #3',
    'Description goes here',
    '2025-11-01',
    'In Review',
    <Button>Leave Comment</Button>
  ),
  createSampleData(
    'Ticket #4',
    'Description goes here',
    '2025-10-01',
    'In Progress',
    <Button>Leave Comment</Button>
  ),
  createSampleData(
    'Ticket #5',
    'Description goes here',
    '2025-05-01',
    'Completed',
    <Button>Leave Comment</Button>
  ),
];

function ClinicianDashboard() {
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
              Clinician Dashboard
            </Typography>
            <GetTodaysDate />
          </Box>
          <Button variant="contained">+ Create Ticket</Button>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard value="5" title="Total Tickets" />
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
          <Typography variant="h5" fontWeight="bold">
            My Tickets
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="My ticket table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Description
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Date Created
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold' }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.ticketID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.ticketID}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row.datecreated}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.comment}</TableCell>
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

export default ClinicianDashboard;
