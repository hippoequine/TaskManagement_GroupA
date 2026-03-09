import { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import AutocompleteSearch from './AutocompleteSearch';
import PropTypes from 'prop-types';

function UserAutocomplete({ userValue, onUserValueChange }) {
  const [inputValue, setInputValue] = useState('');

  const users = AutocompleteSearch('/users/search', inputValue);

  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => option?.fullName ?? ''}
      value={userValue}
      onChange={(event, newValue) => {
        onUserValueChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Reporter" />}
    />
  );
}

UserAutocomplete.propTypes = {
  userValue: PropTypes.object,
  onUserValueChange: PropTypes.func.isRequired,
};

export default UserAutocomplete;
