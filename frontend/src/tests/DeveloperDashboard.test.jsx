import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeveloperDashboard from '../dashboard/DeveloperDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../context/BoardContext', () => ({
  BoardProvider: ({ children }) => <>{children}</>,
}));
vi.mock('../context/IssuesContext', () => ({
  IssuesProvider: ({ children }) => <>{children}</>,
}));
vi.mock('../components/GetTodaysDate', () => ({
  default: () => <div>DateComponent</div>,
}));
vi.mock('../components/IssueTable', () => ({
  default: () => <div>IssueTableComponent</div>,
}));
vi.mock('../components/IssuesPieChart', () => ({
  default: () => <div>IssuesPieChart</div>,
}));
vi.mock('../components/ProjectsPieChart', () => ({
  default: () => <div>ProjectsPieChart</div>,
}));
vi.mock('../components/IssuesCompletedStatCard', () => ({
  default: () => <div>CompletedStat</div>,
}));
vi.mock('../components/IssuesInReviewStatCard', () => ({
  default: () => <div>InReviewStat</div>,
}));
vi.mock('../components/IssuesInProgressStatCard', () => ({
  default: () => <div>InProgressStat</div>,
}));
vi.mock('../components/IssuesBacklogStatCard', () => ({
  default: () => <div>BacklogStat</div>,
}));
vi.mock('../components/ProjectsCompletedStatCard', () => ({
  default: () => <div>ProjectsCompletedStat</div>,
}));

describe('DeveloperDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Dispplays the developer dashboard title and key sections', () => {
    render(
      <MemoryRouter>
        <DeveloperDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/VR Developer Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Workload/i)).toBeInTheDocument();
    expect(screen.getByText('IssueTableComponent')).toBeInTheDocument();
    expect(screen.getByText('IssuesPieChart')).toBeInTheDocument();
  });

  it("navigates to the projects page when 'View Projects' is clicked", () => {
    render(
      <MemoryRouter>
        <DeveloperDashboard />
      </MemoryRouter>
    );

    const viewProjectsBtn = screen.getByRole('button', {
      name: /View Projects/i,
    });
    fireEvent.click(viewProjectsBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });
});
