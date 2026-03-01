import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

function PriorityLabel({ priority, onUpdatePriority }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="priority-label">Priority</InputLabel>
      <Select
        labelId="priority-label"
        label="Priority"
        value={priority}
        onChange={(e) => onUpdatePriority(e.target.value)}
      >
        <MenuItem value="low">low</MenuItem>
        <MenuItem value="medium">medium</MenuItem>
        <MenuItem value="high">high</MenuItem>
      </Select>
    </FormControl>
  );
}

PriorityLabel.propTypes = {
  priority: PropTypes.string,
  onUpdatePriority: PropTypes.func.isRequired,
};

export default PriorityLabel;
