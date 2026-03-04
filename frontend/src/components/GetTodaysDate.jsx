import { Typography } from '@mui/material';

/**
 * Displays today's date based on user's computer clock and language (global)
 * @returns {string} Today's date
 */
function GetTodaysDate() {
  const date = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return <Typography>{date}</Typography>;
}

export default GetTodaysDate;
