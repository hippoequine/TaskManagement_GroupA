import ProjectAutocomplete from '../components/IssueForm/ProjectAutocomplete';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import AutocompleteSearch from '../components/IssueForm/AutocompleteSearch';

vi.mock('../components/IssueForm/AutocompleteSearch', () => ({
  default: vi.fn(),
}));

describe('ProjectAutocomplete', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the options input', () => {
    render(<ProjectAutocomplete value={null} onChange={vi.fn()} />);

    expect(screen.getByLabelText(/project/i)).toBeInTheDocument();
  });

  it('calls AutoCompleteSearch with the input value', async () => {
    AutocompleteSearch.mockReturnValue([]);

    const project = userEvent.setup();

    render(<ProjectAutocomplete value={null} onChange={vi.fn()} />);

    const input = screen.getByRole('combobox');

    await project.type(input, 'app');
    await waitFor(() => {
      expect(AutocompleteSearch).toHaveBeenLastCalledWith(
        '/api/projects',
        'app'
      );
    });
  });

  it('calls onChange when a project is selected', async () => {
    const mockProject = { name: 'Apollo' };
    AutocompleteSearch.mockReturnValue([mockProject]);
    const mockChange = vi.fn();

    render(<ProjectAutocomplete value={null} onChange={mockChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    const options = await screen.findAllByRole('option');
    expect(options[0].textContent).toBe('Apollo');

    fireEvent.click(options[0]);
    expect(mockChange).toHaveBeenCalledWith(mockProject);
  });

  it('renders an empty string for options without name', async () => {
    const mockProject = {};
    AutocompleteSearch.mockReturnValue([mockProject]);
    const mockChange = vi.fn();

    render(<ProjectAutocomplete value={null} onChange={mockChange} />);

    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    const options = await screen.findAllByRole('option');
    expect(options[0].textContent).toBe('');

    fireEvent.click(options[0]);
    expect(mockChange).toHaveBeenCalledWith(mockProject);
  });
});
