import { Card, CardContent, Typography } from '@mui/material';
import { useAllIssues } from '../context/IssuesContext';

function IssuesCompletedStatCard() {
  const { issues, loading } = useAllIssues();

  const totalIssuesCompleted = issues.filter((t) => t.status === 'done').length;
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
          {loading ? 'Loading...' : totalIssuesCompleted}
        </Typography>
        <Typography>Done Issues</Typography>
        <Typography variant="body2">
          {loading ? 'Loading...' : `of ${totalIssues} issues`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IssuesCompletedStatCard;
