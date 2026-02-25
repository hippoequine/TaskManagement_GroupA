import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import AutocompleteSearch from './AutocompleteSearch';
import PropTypes from 'prop-types';

function ProjectAutocomplete({ value, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const projects = AutocompleteSearch('/api/projects', inputValue);

  return (
    <Autocomplete
      options={projects}
      getOptionLabel={(option) => option?.name ?? ''}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Project" />}
    />
  );
}

ProjectAutocomplete.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default ProjectAutocomplete;
