// integration of UI -> api layer
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm';
import ViewIssue from '../components/IssueForm/ViewIssue';
import api from '../api/axios';

// Mocks - api, contexts
vi.mock('../api/axios');

vi.mock('../context/ProjectContext', () => ({
  useProject: () => ({
    currentProject: { id: 'proj-1' },
  }),
}));

vi.mock('../context/BoardContext', () => ({
  useBoard: () => ({
    currentBoard: { id: 'board-1' },
  }),
}));

vi.mock('../auth/useAuth', () => ({
  default: () => ({
    user: { sub: 'user-1' },
  }),
}));

describe('Integration: Create Issue Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('user creates an issue successfully', async () => {
    api.post.mockResolvedValue({
      data: { success: true },
    });

    const mockOnIssueCreation = vi.fn();

    render(<CreateIssueForm onIssueCreation={mockOnIssueCreation} />);

    // Fill in form
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, {
      target: { value: 'Test Issue Title' },
    });

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Issue description' },
    });

    const user = userEvent.setup();

    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.click(prioritySelect);
    const mediumOption = screen.getByText('medium');
    await user.click(mediumOption);

    const storyptSelect = screen.getByRole('button', { name: '5' });
    await user.click(storyptSelect);

    const typeSelect = screen.getByRole('button', { name: 'bug' });
    await user.click(typeSelect);

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /create issue/i,
    });
    fireEvent.click(submitButton);

    // expect statements
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/issues',
        expect.objectContaining({
          title: 'Test Issue Title',
          description: 'Test Issue description',
          priority: 'medium',
          storyPoints: 5,
          type: 'bug',
          projectId: 'proj-1',
          boardId: 'board-1',
          reporterId: 'user-1',
        })
      );
    });

    expect(
      await screen.findByText(/issue created successfully/i)
    ).toBeInTheDocument();

    expect(mockOnIssueCreation).toHaveBeenCalled();
  }, 10000);
});

describe('Integration: View Issue Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIssue = {
    id: 'issue-123',
    title: 'Test Issue Title',
    description: 'Test issue description',
    type: 'story',
    status: 'in_progress',
    priority: 'high',
    storyPoints: 5,
    dueDate: '2026-03-25T12:00:00.000Z',
    reporter: { firstName: 'John', lastName: 'Doe' },
    assignees: [{ firstName: 'Jane', lastName: 'Smith' }],
  };

  test('user views issue details successfully', () => {
    const mockOnClose = vi.fn();
    const mockOnEditSuccess = vi.fn();

    render(
      <ViewIssue
        issue={mockIssue}
        onClose={mockOnClose}
        onEditSuccess={mockOnEditSuccess}
      />
    );

    // Verify all issue details are displayed
    expect(screen.getByText('Test Issue Title')).toBeInTheDocument();
    expect(screen.getByText('Test issue description')).toBeInTheDocument();
    expect(screen.getByText('story')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('user closes issue view', () => {
    const mockOnClose = vi.fn();

    render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

    // Click close button
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('user transitions from view to edit mode', () => {
    const mockOnClose = vi.fn();

    render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

    // Click edit button
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Verify edit form appears with issue data
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Issue Title');
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      'Test issue description'
    );
  });
});
