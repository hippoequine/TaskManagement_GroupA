import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import PropTypes from 'prop-types';

function StoryPointButtonGroup({ points, onUpdatePoints }) {
  return (
    <ToggleButtonGroup
      value={points}
      exclusive
      onChange={(e, value) => {
        onUpdatePoints(value);
      }}
    >
      {[1, 2, 3, 5, 8, 13, 21, 34].map((point) => (
        <ToggleButton key={point} value={point}>
          {point}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

StoryPointButtonGroup.propTypes = {
  points: PropTypes.number,
  onUpdatePoints: PropTypes.func.isRequired,
};

export default StoryPointButtonGroup;
