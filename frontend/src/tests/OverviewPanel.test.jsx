import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OverviewPanel from '../components/OverviewPanel';
import { useUsers } from '../context/UsersContext';
import { useProject } from '../context/ProjectContext';
import { useAllIssues } from '../context/IssuesContext';

vi.mock('../context/UsersContext', () => ({ useUsers: vi.fn() }));
vi.mock('../context/ProjectContext', () => ({ useProject: vi.fn() }));
vi.mock('../context/IssuesContext', () => ({
  useAllIssues: vi.fn(),
}));

vi.mock('./IssuesPieChart', () => ({
  default: () => <div data-testid="mock-pie-chart">Pie Chart</div>,
}));

describe('OverviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useUsers.mockReturnValue({ users: [], loading: false });
    useProject.mockReturnValue({ projects: [], loading: false });

    const defaultIssues = { issues: [], loading: false, error: null };
    useAllIssues.mockReturnValue(defaultIssues);
    useAllIssues.mockReturnValue(defaultIssues);
  });

  it('Shows loading states for all sections', () => {
    useUsers.mockReturnValue({ users: [], loading: true });
    useProject.mockReturnValue({ projects: [], loading: true });
    useAllIssues.mockReturnValue({ issues: [], loading: true });
    useAllIssues.mockReturnValue({ issues: [], loading: true });

    render(<OverviewPanel />);

    const loadingText = screen.getAllByText(/Loading.../i);
    expect(loadingText.length).toBeGreaterThanOrEqual(1);
  });

  it('Shows "No found" messages when arrays are empty', () => {
    render(<OverviewPanel />);

    expect(screen.getByText(/No issues found!/i)).toBeInTheDocument();
    expect(screen.getByText(/No projects found!/i)).toBeInTheDocument();
  });

  it('correctly sorts and displays the 3 latest issues', () => {
    const mockIssues = [
      { id: '1', title: 'Old Issue', updatedAt: '2020-01-01' },
      {
        id: '2',
        title: 'Newest Issue',
        updatedAt: '2026-01-01',
        assignees: [{ firstName: 'A', lastName: 'B' }],
      },
      { id: '3', title: 'Middle Issue', updatedAt: '2024-01-01' },
      { id: '4', title: 'Hello there', updatedAt: '2019-01-01' },
    ];

    useAllIssues.mockReturnValue({ issues: mockIssues, loading: false });
    useAllIssues.mockReturnValue({ issues: mockIssues, loading: false });

    render(<OverviewPanel />);

    expect(screen.getByText('Newest Issue')).toBeInTheDocument();
    expect(screen.queryByText('Hello there')).not.toBeInTheDocument();
  });

  it('correctly sorts and displays the 3 latest Users and Projects', () => {
    const mockUsers = [
      {
        id: 'u1',
        fullName: 'Oldest User',
        createdAt: '2020-01-01',
        role: 'admin',
      },
      {
        id: 'u2',
        fullName: 'Newest User',
        createdAt: '2026-01-01',
        role: 'developer',
      },
      {
        id: 'u3',
        fullName: 'Middle User',
        createdAt: '2024-01-01',
        role: 'clinician',
      },
      {
        id: 'u4',
        fullName: 'Hello User',
        createdAt: '2019-01-01',
        role: 'admin',
      },
    ];

    const mockProjects = [
      {
        id: 'p1',
        name: 'Oldest Proj',
        created_at: '2020-01-01',
        status: 'completed',
      },
      {
        id: 'p2',
        name: 'Newest Proj',
        created_at: '2026-01-01',
        status: 'active',
      },
      {
        id: 'p3',
        name: 'Middle Proj',
        created_at: '2024-01-01',
        status: 'active',
      },
      {
        id: 'p4',
        name: 'Hello Proj',
        created_at: '2019-01-01',
        status: 'completed',
      },
    ];

    useUsers.mockReturnValue({ users: mockUsers, loading: false });
    useProject.mockReturnValue({ projects: mockProjects, loading: false });

    render(<OverviewPanel />);

    // Verify User Sorting/Slicing
    expect(screen.getByText('Newest User')).toBeInTheDocument();
    expect(screen.queryByText('Hello User')).not.toBeInTheDocument();

    // Verify Project Sorting/Slicing
    expect(screen.getByText('Newest Proj')).toBeInTheDocument();
    expect(screen.queryByText('Hello Proj')).not.toBeInTheDocument();
  });

  it('Displays "Unassigned" when issue assignees or project owners are missing', () => {
    const mockIssues = [
      {
        id: '1',
        title: 'Ghost Issue',
        updatedAt: '2024-01-01',
        assignees: [],
        status: 'backlog',
        priority: 'low',
      },
    ];

    const mockProjects = [
      {
        id: 'p1',
        name: 'Ghost Project',
        created_at: '2024-01-01',
        owner: null,
        status: 'active',
      },
    ];

    useAllIssues.mockReturnValue({ issues: mockIssues, loading: false });
    useProject.mockReturnValue({ projects: mockProjects, loading: false });

    render(<OverviewPanel />);

    const unassignedElements = screen.getAllByText('Unassigned');
    expect(unassignedElements.length).toBeGreaterThanOrEqual(2);
  });

  it('Shows N/A for missing dates', () => {
    useAllIssues.mockReturnValue({
      issues: [{ id: '1', title: 'Test', updatedAt: null }],
      loading: false,
    });

    render(<OverviewPanel />);

    const naTexts = screen.getAllByText('N/A');
    expect(naTexts.length).toBeGreaterThanOrEqual(1);
  });
});
