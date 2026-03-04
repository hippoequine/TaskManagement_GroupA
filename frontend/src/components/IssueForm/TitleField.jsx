import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

function TitleField({ title, onUpdateTitle }) {
  return (
    <TextField
      label="Title"
      placeholder="frontend, api, sprint-12"
      value={title}
      onChange={(e) => onUpdateTitle(e.target.value)}
    />
  );
}

TitleField.propTypes = {
  title: PropTypes.string,
  onUpdateTitle: PropTypes.func.isRequired,
};

export default TitleField;
