import { Card, CardContent, Typography } from '@mui/material';
import { useAllIssues } from '../context/IssuesContext';

function IssuesBacklogStatCard() {
  const { issues, loading } = useAllIssues();

  const totalIssuesBacklog = issues.filter(
    (t) => t.status === 'backlog'
  ).length;
  const totalIssues = issues.length;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        width: '100%',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {loading ? 'Loading...' : totalIssuesBacklog}
        </Typography>
        <Typography>Backlog Issues</Typography>
        <Typography variant="body2">
          {loading ? 'Loading...' : `of ${totalIssues} issues`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IssuesBacklogStatCard;
