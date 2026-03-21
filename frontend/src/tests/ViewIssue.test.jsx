// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewIssue from '../components/IssueForm/ViewIssue';

// Mock CreateIssueForm
vi.mock('../components/IssueForm/CreateIssueForm', () => ({
  default: ({ initialData, onIssueCreation }) => (
    <div data-testid="edit-form">
      <div>Editing: {initialData.title}</div>
      <button onClick={() => onIssueCreation(false)}>Save</button>
    </div>
  ),
}));

describe('ViewIssue', () => {
  const mockIssue = {
    id: '123',
    title: 'Test Issue',
    description: 'Test Description',
    issueType: 'bug',
    priority: 'high',
    storyPoints: 3,
    project: { name: 'Test Project' },
    reporter: { name: 'Test User' },
    dueDate: '2025-04-15T00:00:00Z',
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays issue details', () => {
    render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

    expect(screen.getByText('Test Issue')).toBeDefined();
    expect(screen.getByText(/Test Description/)).toBeDefined();
    expect(screen.getByText(/bug/)).toBeDefined();
    expect(screen.getByText(/high/)).toBeDefined();
    expect(screen.getByText(/3/)).toBeDefined();
  });

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('switches to edit mode when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

    expect(screen.queryByTestId('edit-form')).toBeNull();

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByTestId('edit-form')).toBeDefined();
    expect(screen.getByText(/Editing: Test Issue/)).toBeDefined();
  });
});
