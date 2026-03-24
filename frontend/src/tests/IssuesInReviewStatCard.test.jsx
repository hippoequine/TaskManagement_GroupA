import { render, screen, cleanup } from '@testing-library/react';
import IssuesInReviewStatCard from '../components/IssuesInReviewStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as IssuesContext from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesInReviewStatCard', () => {
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

    render(<IssuesInReviewStatCard />);

    const loadingElements = screen.getAllByText('Loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of issues in review', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [
        { status: 'reviewed' },
        { status: 'reviewed' },
        { status: 'in progress' },
      ],
      loading: false,
    });

    render(<IssuesInReviewStatCard />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('of 3 issues')).toBeInTheDocument();
  });
});
