import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import UserAutoComplete from '../components/IssueForm/UserAutoComplete';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';

vi.mock('../components/IssueForm/AutocompleteSearch', () => ({
  default: vi.fn(),
}));

describe('UserAutoComplete', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the reporter input', () => {
    render(<UserAutoComplete userValue={null} onUserValueChange={vi.fn()} />);

    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
  });

  it('calls AutoCompleteSearch with the input value', async () => {
    AutocompleteSearch.mockReturnValue([]);

    const user = userEvent.setup();

    render(<UserAutoComplete userValue={null} onUserValueChange={vi.fn()} />);

    const input = screen.getByRole('combobox');

    await user.type(input, 'Alice');
    await waitFor(() => {
      expect(AutocompleteSearch).toHaveBeenLastCalledWith(
        '/users/search',
        'Alice'
      );
    });
  });

  it('calls onUserValueChange when a user is selected', async () => {
    const mockUser = { fullName: 'Alice' };
    AutocompleteSearch.mockReturnValue([mockUser]);
    const mockChange = vi.fn();
    render(
      <UserAutoComplete userValue={null} onUserValueChange={mockChange} />
    );

    const input = screen.getByRole('combobox');

    fireEvent.mouseDown(input);

    const option = await screen.findByText('Alice');
    fireEvent.click(option);

    expect(mockChange).toHaveBeenCalledWith(mockUser);
  });

  it('renders empty string for options without full name', async () => {
    const mockUser = {};
    AutocompleteSearch.mockReturnValue([mockUser]);
    const mockChange = vi.fn();
    render(
      <UserAutoComplete userValue={null} onUserValueChange={mockChange} />
    );

    const input = screen.getByRole('combobox');

    fireEvent.mouseDown(input);

    const options = await screen.findAllByRole('option');
    expect(options[0].textContent).toBe('');

    fireEvent.click(options[0]);
    expect(mockChange).toHaveBeenCalledWith(mockUser);
  });
});
