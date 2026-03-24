import { render, screen, cleanup } from '@testing-library/react';
import IssuesPieChart from '../components/IssuesPieChart';
import { useAllIssues } from '../context/IssuesContext';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PieChart } from '@mui/x-charts';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesPieChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading state when issues are being fetched', () => {
    useAllIssues.mockReturnValue({
      issues: [],
      loading: true,
    });

    render(<IssuesPieChart />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays an svg when issues are loaded', () => {
    useAllIssues.mockReturnValue({
      issues: [
        { status: 'backlog' },
        { status: 'in_progress' },
        { status: 'reviewed' },
        { status: 'done' },
        { status: 'done' },
      ],
      loading: false,
    });

    render(<IssuesPieChart />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
