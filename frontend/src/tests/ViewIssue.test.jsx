// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewIssue from '../components/IssueForm/ViewIssue';

// Mock CreateIssueForm since ViewIssue uses it in edit mode
vi.mock('../components/IssueForm/CreateIssueForm', () => ({
  default: ({ mode, issueId, onIssueCreation }) => (
    <div data-testid="create-issue-form">
      <span data-testid="form-mode">{mode}</span>
      <span data-testid="form-issue-id">{issueId}</span>
      <button onClick={onIssueCreation} data-testid="mock-save">
        Save
      </button>
    </div>
  ),
}));

describe('ViewIssue', () => {
  const mockIssue = {
    id: 'issue-123',
    title: 'Test Issue Title',
    description: 'Test issue description',
    type: 'story',
    status: 'in_progress',
    priority: 'high',
    storyPoints: 5,
    dueDate: '2026-03-25T00:00:00.000Z',
    reporter: { firstName: 'John', lastName: 'Doe' },
    assignees: [{ firstName: 'Jane', lastName: 'Smith' }],
  };

  const mockOnClose = vi.fn();
  const mockOnEditSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering issue details', () => {
    it('renders issue title', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('Test Issue Title')).toBeInTheDocument();
    });

    it('renders issue description', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('Test issue description')).toBeInTheDocument();
    });

    it('renders "No description provided." when description is empty', () => {
      const issueNoDesc = { ...mockIssue, description: '' };
      render(<ViewIssue issue={issueNoDesc} onClose={mockOnClose} />);
      expect(screen.getByText('No description provided.')).toBeInTheDocument();
    });

    it('renders issue type', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('story')).toBeInTheDocument();
    });

    it('renders priority', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('renders story points', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders "Not set" when story points is null', () => {
      const issueNoPoints = { ...mockIssue, storyPoints: null };
      render(<ViewIssue issue={issueNoPoints} onClose={mockOnClose} />);
      expect(screen.getByText('Not set')).toBeInTheDocument();
    });

    it('renders due date formatted', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      // Date format depends on locale, but should contain the date
      expect(screen.getByText(/\d{1,2}\/\d{1,2}\/2026/)).toBeInTheDocument();
    });

    it('renders "Not set" when due date is null', () => {
      const issueNoDate = { ...mockIssue, dueDate: null };
      render(<ViewIssue issue={issueNoDate} onClose={mockOnClose} />);
      const notSetElements = screen.getAllByText('Not set');
      expect(notSetElements.length).toBeGreaterThan(0);
    });

    it('renders reporter name', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders assignee name', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders "None" when no assignees', () => {
      const issueNoAssignee = { ...mockIssue, assignees: [] };
      render(<ViewIssue issue={issueNoAssignee} onClose={mockOnClose} />);
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  describe('status chip', () => {
    it('renders status chip with correct label for in_progress', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('renders status chip with correct label for backlog', () => {
      const backlogIssue = { ...mockIssue, status: 'backlog' };
      render(<ViewIssue issue={backlogIssue} onClose={mockOnClose} />);
      expect(screen.getByText('Backlog')).toBeInTheDocument();
    });

    it('renders status chip with correct label for reviewed', () => {
      const reviewedIssue = { ...mockIssue, status: 'reviewed' };
      render(<ViewIssue issue={reviewedIssue} onClose={mockOnClose} />);
      expect(screen.getByText('In Review')).toBeInTheDocument();
    });

    it('renders status chip with correct label for done', () => {
      const doneIssue = { ...mockIssue, status: 'done' };
      render(<ViewIssue issue={doneIssue} onClose={mockOnClose} />);
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('renders raw status when unknown status', () => {
      const unknownIssue = { ...mockIssue, status: 'custom_status' };
      render(<ViewIssue issue={unknownIssue} onClose={mockOnClose} />);
      expect(screen.getByText('custom_status')).toBeInTheDocument();
    });
  });

  describe('type colors', () => {
    it('renders epic type', () => {
      const epicIssue = { ...mockIssue, type: 'epic' };
      render(<ViewIssue issue={epicIssue} onClose={mockOnClose} />);
      expect(screen.getByText('epic')).toBeInTheDocument();
    });

    it('renders task type', () => {
      const taskIssue = { ...mockIssue, type: 'task' };
      render(<ViewIssue issue={taskIssue} onClose={mockOnClose} />);
      expect(screen.getByText('task')).toBeInTheDocument();
    });

    it('renders bug type', () => {
      const bugIssue = { ...mockIssue, type: 'bug' };
      render(<ViewIssue issue={bugIssue} onClose={mockOnClose} />);
      expect(screen.getByText('bug')).toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('renders Close button', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });

    it('renders Edit button', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('calls onClose when Close button is clicked', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode', () => {
    it('switches to CreateIssueForm when Edit button is clicked', () => {
      render(<ViewIssue issue={mockIssue} onClose={mockOnClose} />);

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByTestId('create-issue-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-mode')).toHaveTextContent('edit');
      expect(screen.getByTestId('form-issue-id')).toHaveTextContent(
        'issue-123'
      );
    });

    it('calls onEditSuccess when edit is saved', () => {
      render(
        <ViewIssue
          issue={mockIssue}
          onClose={mockOnClose}
          onEditSuccess={mockOnEditSuccess}
        />
      );

      // Switch to edit mode
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));

      // Simulate save
      fireEvent.click(screen.getByTestId('mock-save'));

      expect(mockOnEditSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
