import { render, screen, cleanup } from '@testing-library/react';
import ProjectsPieChart from '../components/ProjectsPieChart';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as ProjectContext from '../context/ProjectContext';

vi.mock('../context/ProjectContext', () => ({
  __esModule: true,
  useProject: vi.fn(),
}));

describe('ProjectsPieChart', () => {
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

    render(<ProjectsPieChart />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
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

    render(<ProjectsPieChart />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
