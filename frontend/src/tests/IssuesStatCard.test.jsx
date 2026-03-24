import { render, screen, cleanup } from '@testing-library/react';
import IssuesStatCard from '../components/IssuesStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as IssuesContext from '../context/IssuesContext';

vi.mock('../context/IssuesContext', () => ({
  __esModule: true,
  useAllIssues: vi.fn(),
}));

describe('IssuesStatCard', () => {
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
      error: null,
    });

    render(<IssuesStatCard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays the correct number of issues', () => {
    IssuesContext.useAllIssues.mockReturnValue({
      issues: [
        { status: 'backlog' },
        { status: 'in progress' },
        { status: 'done' },
      ],
      loading: false,
      error: null,
    });

    render(<IssuesStatCard />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
