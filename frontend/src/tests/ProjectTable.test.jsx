import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectTable from '../components/ProjectTable';
import { useProject } from '../context/ProjectContext';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock('../context/ProjectContext', () => ({
  useProject: vi.fn(),
}));

describe('ProjectTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    useProject.mockReturnValue({ projects: [], loading: true, error: null });
    render(<ProjectTable />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    useProject.mockReturnValue({
      projects: [],
      loading: false,
      error: 'Database error',
    });
    render(<ProjectTable />);

    expect(screen.getByText(/Error: Database error/i)).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    useProject.mockReturnValue({ projects: [], loading: false, error: null });
    render(<ProjectTable />);

    expect(screen.getByText(/No projects found!/i)).toBeInTheDocument();
  });

  it('Displays projects and navigates on row click', () => {
    const mockProjects = [
      {
        id: 'p1',
        name: 'Project Sushi',
        key: 'SUS',
        description: 'First project',
        category: 'Software',
        owner: { firstName: 'Jane', lastName: 'Doe' },
        status: 'active',
        created_at: '2023-01-01T12:00:00Z',
      },
      {
        id: 'p2',
        name: 'Project Cat',
        key: 'CAT',
        description: 'Second project',
        category: 'Marketing',
        owner: null,
        status: 'completed',
        created_at: '2023-02-01T12:00:00Z',
      },
    ];

    useProject.mockReturnValue({
      projects: mockProjects,
      loading: false,
      error: null,
    });

    render(<ProjectTable />);

    expect(screen.getByText('Project Sushi')).toBeInTheDocument();
    expect(screen.getByText('SUS')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();

    const firstRow = screen.getByText('Project Sushi').closest('tr');
    fireEvent.click(firstRow);
    expect(mockNavigate).toHaveBeenCalledWith('/projects/p1');
  });
});
