import { render, screen, cleanup } from '@testing-library/react';
import ProjectsCompletionRateStatCard from '../components/ProjectsCompletionRateStatCard';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as ProjectContext from '../context/ProjectContext';

vi.mock('../context/ProjectContext', () => ({
  __esModule: true,
  useProject: vi.fn(),
}));

describe('ProjectsCompletionRateStatCard', () => {
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

    render(<ProjectsCompletionRateStatCard />);

    const loadingElement = screen.getByText((text) => text.includes('loading'));
    expect(loadingElement).toBeInTheDocument();
  });

  it('displays the correct completion rate', () => {
    ProjectContext.useProject.mockReturnValue({
      projects: [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'active' },
      ],
      loading: false,
    });

    render(<ProjectsCompletionRateStatCard />);

    expect(
      screen.getByText((content) => content.includes('67%'))
    ).toBeInTheDocument();
  });
});
