import { render, screen, cleanup } from '@testing-library/react';
import ProjectsCompletedStatCard from '../components/ProjectsCompletedStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as ProjectContext from '../context/ProjectContext';

vi.mock('../context/ProjectContext', () => ({
  __esModule: true,
  useProject: vi.fn(),
}));

describe('ProjectsCompletedStatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading state when projects are being fetched', () => {
    ProjectContext.useProject.mockReturnValue({
      projects: [],
      loading: true,
    });

    render(<ProjectsCompletedStatCard />);

    const loadingElements = screen.getAllByText('loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of projects completed', () => {
    ProjectContext.useProject.mockReturnValue({
      projects: [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'active' },
      ],
      loading: false,
    });

    render(<ProjectsCompletedStatCard />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('of 3 projects')).toBeInTheDocument();
  });
});
