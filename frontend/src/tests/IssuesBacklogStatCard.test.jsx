import { render, screen, cleanup } from '@testing-library/react';
import IssuesBacklogStatCard from '../components/IssuesBacklogStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as IssuesContext from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesBacklogStatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading state when issues are being fetched', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [],
      loading: true,
    });

    render(<IssuesBacklogStatCard />);

    const loadingElements = screen.getAllByText('Loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of issues in the backlog', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [
        { status: 'backlog' },
        { status: 'done' },
        { status: 'in progress' },
      ],
      loading: false,
    });

    render(<IssuesBacklogStatCard />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('of 3 issues')).toBeInTheDocument();
  });
});
