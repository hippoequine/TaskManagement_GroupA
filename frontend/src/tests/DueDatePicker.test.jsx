// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DueDatePicker from '../components/IssueForm/DueDatePicker';

// Mock dayjs and date picker to simplify testing
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid="date-picker"
        type="date"
        value={value ? value.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : null;
          onChange(newDate);
        }}
      />
    </div>
  ),
}));

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: {},
}));

describe('DueDatePicker', () => {
  const mockOnDueDateUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the date picker with label', () => {
    render(
      <DueDatePicker dueDate={null} onDueDateUpdate={mockOnDueDateUpdate} />
    );

    expect(screen.getAllByText('Due Date:')[0]).toBeDefined();
    expect(screen.getAllByTestId('date-picker')[0]).toBeDefined();
  });

  it('displays the provided due date', () => {
    const testDate = new Date('2025-04-15');
    render(
      <DueDatePicker dueDate={testDate} onDueDateUpdate={mockOnDueDateUpdate} />
    );

    const dateInput = screen.getAllByTestId('date-picker')[0];
    expect(dateInput).toHaveValue('2025-04-15');
  });

  it('calls onDueDateUpdate when user selects a date', async () => {
    const user = userEvent.setup();
    render(
      <DueDatePicker dueDate={null} onDueDateUpdate={mockOnDueDateUpdate} />
    );

    const dateInput = screen.getAllByTestId('date-picker')[0];
    await user.type(dateInput, '2025-05-20');

    expect(mockOnDueDateUpdate).toHaveBeenCalled();
  });

  it('handles empty date input', async () => {
    const user = userEvent.setup();
    render(
      <DueDatePicker
        dueDate={new Date('2025-04-15')}
        onDueDateUpdate={mockOnDueDateUpdate}
      />
    );

    const dateInput = screen.getAllByTestId('date-picker')[0];
    await user.clear(dateInput);

    expect(mockOnDueDateUpdate).toHaveBeenCalledWith(null);
  });
});
