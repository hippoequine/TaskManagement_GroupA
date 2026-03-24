import { render, screen, cleanup } from '@testing-library/react';
import IssuesCompletedStatCard from '../components/IssuesCompletedStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as IssuesContext from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesCompletedStatCard', () => {
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

    render(<IssuesCompletedStatCard />);

    const loadingElements = screen.getAllByText('Loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of issues done', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [
        { status: 'done' },
        { status: 'done' },
        { status: 'done' },
        { status: 'in progress' },
      ],
      loading: false,
    });

    render(<IssuesCompletedStatCard />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('of 4 issues')).toBeInTheDocument();
  });
});
