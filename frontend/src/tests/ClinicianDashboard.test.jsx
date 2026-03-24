import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClinicianDashboard from '../dashboard/ClinicianDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../components/GetTodaysDate', () => ({
  default: () => <div>DateComponent</div>,
}));
vi.mock('../components/ProjectsStatCard', () => ({
  default: () => <div>TotalProjects</div>,
}));
vi.mock('../components/ProjectsActiveStatCard', () => ({
  default: () => <div>ActiveProjects</div>,
}));
vi.mock('../components/ProjectsCompletedStatCard', () => ({
  default: () => <div>CompletedProjects</div>,
}));
vi.mock('../components/ProjectsCompletionRateStatCard', () => ({
  default: () => <div>CompletionRate</div>,
}));
vi.mock('../components/ProjectTable', () => ({
  default: () => <div>ProjectTableComponent</div>,
}));

describe('ClinicianDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard title and child components', () => {
    render(
      <MemoryRouter>
        <ClinicianDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Clinician Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/My Projects/i)).toBeInTheDocument();
    expect(screen.getByText('ProjectTableComponent')).toBeInTheDocument();
    expect(screen.getByText('TotalProjects')).toBeInTheDocument();
  });

  it('navigates to create project page when the button is clicked', () => {
    render(
      <MemoryRouter>
        <ClinicianDashboard />
      </MemoryRouter>
    );

    const createButton = screen.getByRole('button', {
      name: /\+ Create Project/i,
    });
    fireEvent.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('/projects/create');
  });
});
