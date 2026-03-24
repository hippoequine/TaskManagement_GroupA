import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IssueTable from '../components/IssueTable';
import { useAllIssues } from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  useAllIssues: vi.fn(),
}));

describe('IssueTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Displays loading state correctly', () => {
    useAllIssues.mockReturnValue({ issues: [], loading: true, error: null });

    render(<IssueTable />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('Displays error state correctly', () => {
    const errorMessage = 'Failed to fetch issues';
    useAllIssues.mockReturnValue({
      issues: [],
      loading: false,
      error: errorMessage,
    });

    render(<IssueTable />);

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('Displays empty state when no issues are found', () => {
    useAllIssues.mockReturnValue({ issues: [], loading: false, error: null });

    render(<IssueTable />);

    expect(screen.getByText('No issues found.')).toBeInTheDocument();
  });

  it('Displays a list of issues correctly', () => {
    const mockIssues = [
      {
        id: '1',
        title: 'Fix Bug',
        status: 'in_progress',
        assignee: { fullName: 'John Doe' },
        dueDate: '2024-12-31',
      },
      {
        id: '2',
        title: 'Update Docs',
        status: 'done',
        assignee: null,
        dueDate: null,
      },
    ];

    useAllIssues.mockReturnValue({
      issues: mockIssues,
      loading: false,
      error: null,
    });

    render(<IssueTable />);

    expect(screen.getByText('Fix Bug')).toBeInTheDocument();
    expect(screen.getByText('Update Docs')).toBeInTheDocument();
    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('done')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
