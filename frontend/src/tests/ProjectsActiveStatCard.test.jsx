import { render, screen, cleanup } from '@testing-library/react';
import ProjectsActiveStatCard from '../components/ProjectsActiveStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as ProjectContext from '../context/ProjectContext';

vi.mock('../context/ProjectContext', () => ({
  __esModule: true,
  useProject: vi.fn(),
}));

describe('ProjectsActiveStatCard', () => {
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

    render(<ProjectsActiveStatCard />);

    const loadingElements = screen.getAllByText('loading...');

    expect(loadingElements).toHaveLength(2);
  });

  it('displays the correct number of projects active', () => {
    ProjectContext.useProject.mockReturnValue({
      projects: [
        { status: 'active' },
        { status: 'active' },
        { status: 'active' },
        { status: 'completed' },
      ],
      loading: false,
    });

    render(<ProjectsActiveStatCard />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('of 4 projects')).toBeInTheDocument();
  });
});
