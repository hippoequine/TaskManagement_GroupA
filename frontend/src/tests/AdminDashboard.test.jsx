import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AdminDashboard from '../dashboard/AdminDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../components/UsersStatCard', () => ({
  default: () => <div>Users Card</div>,
}));
vi.mock('../components/ProjectsStatCard', () => ({
  default: () => <div>Projects Card</div>,
}));
vi.mock('../components/IssuesStatCard', () => ({
  default: () => <div>Issues Card</div>,
}));
vi.mock('../components/ProjectsCompletionRateStatCard', () => ({
  default: () => <div>Rate Card</div>,
}));
vi.mock('../components/UserTable', () => ({
  default: () => <div>User Table</div>,
}));
vi.mock('../components/ProjectTable', () => ({
  default: () => <div>Project Table</div>,
}));
vi.mock('../components/IssueTable', () => ({
  default: () => <div>Issue Table</div>,
}));
vi.mock('../components/OverviewPanel', () => ({
  default: () => <div>Overview Panel</div>,
}));
vi.mock('../components/GetTodaysDate', () => ({
  default: () => <div>Date</div>,
}));
vi.mock('../components/CustomTabPanel', () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock('../context/ProjectContext', () => ({
  ProjectProvider: ({ children }) => children,
}));
vi.mock('../context/BoardContext', () => ({
  BoardProvider: ({ children }) => children,
}));
vi.mock('../context/IssuesContext', () => ({
  IssuesProvider: ({ children }) => children,
}));

describe('AdminDashboard', () => {
  it("navigates when 'ADD USERS' is clicked", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /add users/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
