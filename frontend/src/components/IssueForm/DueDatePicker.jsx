import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';

function DueDatePicker({ dueDate, onDueDateUpdate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Due Date: "
        value={dueDate}
        onChange={(newValue) => {
          onDueDateUpdate(newValue);
        }}
        disablePast
      />
    </LocalizationProvider>
  );
}

DueDatePicker.propTypes = {
  dueDate: PropTypes.object,
  onDueDateUpdate: PropTypes.func.isRequired,
};

export default DueDatePicker;
