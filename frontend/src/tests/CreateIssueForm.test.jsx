// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm';

// Mock API
vi.mock('../api/axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

// Simple mocks for child components
vi.mock('../components/IssueForm/TitleField', () => ({
  default: ({ title, onUpdateTitle }) => (
    <input
      data-testid="title"
      value={title || ''}
      onChange={(e) => onUpdateTitle(e.target.value)}
    />
  ),
}));

vi.mock('../components/IssueForm/ProjectAutocomplete', () => ({
  default: () => (
    <select data-testid="project">
      <option>Project</option>
    </select>
  ),
}));

vi.mock('../components/IssueForm/issueTypeToggle', () => ({
  default: () => (
    <select data-testid="type">
      <option>Story</option>
    </select>
  ),
}));

vi.mock('../components/IssueForm/DescriptionField', () => ({
  default: () => <textarea data-testid="description" />,
}));

vi.mock('../components/IssueForm/DueDatePicker', () => ({
  default: () => <input data-testid="due-date" type="date" />,
}));

vi.mock('../components/IssueForm/userAutoComplete', () => ({
  default: () => (
    <select data-testid="reporter">
      <option>User</option>
    </select>
  ),
}));

vi.mock('../components/IssueForm/PriorityLabel', () => ({
  default: () => (
    <select data-testid="priority">
      <option>Low</option>
    </select>
  ),
}));

vi.mock('../components/IssueForm/StoryPointButtonGroup', () => ({
  default: () => (
    <select data-testid="story-points">
      <option>1</option>
    </select>
  ),
}));

describe('CreateIssueForm', () => {
  const mockOnIssueCreation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form', () => {
    render(<CreateIssueForm onIssueCreation={mockOnIssueCreation} />);
    expect(screen.getByText('Create New Issue')).toBeDefined();
    expect(screen.getByTestId('title')).toBeDefined();
    expect(screen.getByRole('button', { name: /create issue/i })).toBeDefined();
  });

  it('enables submit button when user types a title', async () => {
    const user = userEvent.setup();
    render(<CreateIssueForm onIssueCreation={mockOnIssueCreation} />);

    const titleInput = screen.getByTestId('title');
    const submitButton = screen.getByRole('button', { name: /create issue/i });

    expect(submitButton).toBeDisabled();

    await user.type(titleInput, 'Test Issue');

    expect(submitButton).not.toBeDisabled();
  });
});
