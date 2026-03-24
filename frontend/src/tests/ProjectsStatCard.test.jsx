import { render, screen, cleanup } from '@testing-library/react';
import ProjectsStatCard from '../components/ProjectsStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as ProjectContext from '../context/ProjectContext';

vi.mock('../context/ProjectContext', () => ({
  __esModule: true,
  useProject: vi.fn(),
}));

describe('ProjectsStatCard', () => {
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
      error: null,
    });

    render(<ProjectsStatCard />);

    expect(screen.getByText('loading...')).toBeInTheDocument();
  });

  it('displays the correct number of projects', () => {
    ProjectContext.useProject.mockReturnValue({
      projects: [
        { status: 'backlog' },
        { status: 'in progress' },
        { status: 'done' },
      ],
      loading: false,
      error: null,
    });

    render(<ProjectsStatCard />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
