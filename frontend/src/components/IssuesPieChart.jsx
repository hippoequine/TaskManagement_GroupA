import { Box, Typography } from '@mui/material';
import { useAllIssues } from '../context/IssuesContext';
import { PieChart } from '@mui/x-charts';

function IssuesPieChart() {
  const { issues, loading } = useAllIssues();

  const totalBacklog = issues.filter((t) => t.status === 'backlog').length;
  const totalInProgress = issues.filter(
    (t) => t.status === 'in_progress'
  ).length;
  const totalInReview = issues.filter((t) => t.status === 'reviewed').length;
  const totalCompleted = issues.filter((t) => t.status === 'done').length;

  const pieData =
    issues.length === 0
      ? [{ id: 0, label: 'No Issues', value: 1, color: '#ccc' }]
      : [
          { id: 0, label: 'Backlog', value: totalBacklog, color: '#9C27B0' },
          {
            id: 1,
            label: 'In Progress',
            value: totalInProgress,
            color: '#E91E63',
          },
          { id: 2, label: 'In Review', value: totalInReview, color: '#ffc658' },
          {
            id: 3,
            label: 'Completed',
            value: totalCompleted,
            color: '#ff7300',
          },
        ].filter((d) => d.value > 0);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
      }}
    >
      {!loading ? (
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 40,
              outerRadius: 80,
              paddingAngle: issues.length === 0 ? 0 : 2,
              cornerRadius: 2,
            },
          ]}
          height={200}
        />
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}

export default IssuesPieChart;
