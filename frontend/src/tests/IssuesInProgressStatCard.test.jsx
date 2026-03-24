import { render, screen, cleanup } from '@testing-library/react';
import IssuesInProgressStatCard from '../components/IssuesInProgressStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as IssuesContext from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesInProgressStatCard', () => {
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

    render(<IssuesInProgressStatCard />);

    const loadingElements = screen.getAllByText('Loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of issues in progress', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [
        { status: 'in_progress' },
        { status: 'in_progress' },
        { status: 'done' },
        { status: 'reviewed' },
      ],
      loading: false,
    });

    render(<IssuesInProgressStatCard />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('of 4 issues')).toBeInTheDocument();
  });
});
