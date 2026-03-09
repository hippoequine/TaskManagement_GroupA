import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

function DescriptionField({ description, onUpdateDescription }) {
  return (
    <TextField
      label="Description: "
      multiline
      minRows={4}
      value={description}
      onChange={(e) => {
        onUpdateDescription(e.target.value);
      }}
      placeholder="Please describe this task here."
    />
  );
}

DescriptionField.propTypes = {
  description: PropTypes.string,
  onUpdateDescription: PropTypes.func.isRequired,
};

export default DescriptionField;
