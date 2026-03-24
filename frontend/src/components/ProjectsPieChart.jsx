import { Box, Typography } from '@mui/material';
import { useProject } from '../context/ProjectContext';
import { PieChart } from '@mui/x-charts';

function ProjectsPieChart() {
  const { projects, loading } = useProject();

  const totalActive = projects.filter((p) => p.status === 'active').length;
  const totalCompleted = projects.filter(
    (p) => p.status === 'completed'
  ).length;

  const pieData =
    projects.length === 0
      ? [{ id: 0, label: 'No Projects', value: 1, color: '#ccc' }]
      : [
          { id: 0, label: 'Active', value: totalActive, color: '#9C27B0' },
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
              paddingAngle: projects.length === 0 ? 0 : 1,
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

export default ProjectsPieChart;
