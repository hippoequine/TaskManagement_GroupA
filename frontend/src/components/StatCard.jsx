import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Displays a reusable Stat card for the dashboard that displays a value, title, and subtitle
 * @param {string|number} value - The main statistic to display
 * @param {string} title - the label or title describing the statistic
 * @param {string|number} subtitle - additional info about the stat (optional)
 * @returns A material-UI card
 */
function StatCard({ value, title, subtitle }) {
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
          {value}
        </Typography>

        <Typography>{title}</Typography>

        {/* Optional parameter */}
        {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default StatCard;
