import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, vi, beforeEach, expect } from 'vitest';

import { ProjectProvider } from '../context/ProjectContext';
import ProjectsPage from '../pages/Projects';
import { projectsApi } from '../api/projectsApi';

// Mock auth hook
vi.mock('../auth/useAuth', () => ({
  default: () => ({
    isAuthenticated: true,
  }),
}));

// Mock project API
vi.mock('../api/projectsApi', () => ({
  projectsApi: {
    getAll: vi.fn(),
  },
}));

describe('Integration: Project List Retrieval', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('fetches and displays projects when an authenticated user opens /projects', async () => {
    projectsApi.getAll.mockResolvedValue({
      data: {
        projects: [
          {
            id: 1,
            name: 'Project One',
            key: 'one',
            category: 'New Development',
            status: 'active',
            created_at: '2026-03-01T12:00:00.000Z',
            owner: {
              firstName: 'Test',
              lastName: 'Clinician',
            },
          },
          {
            id: 2,
            name: 'Project Two',
            key: 'two',
            category: 'Maintenance',
            status: 'completed',
            created_at: '2026-03-02T12:00:00.000Z',
            owner: {
              firstName: 'Test2',
              lastName: 'Clinician2',
            },
          },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectProvider>
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </ProjectProvider>
      </MemoryRouter>
    );

    await screen.findByText('Project One');

    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();

    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();

    expect(screen.getByText('New Development')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();

    expect(screen.getByText('Test Clinician')).toBeInTheDocument();
    expect(screen.getByText('Test2 Clinician2')).toBeInTheDocument();

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows error state when project fetch fails', async () => {
    projectsApi.getAll.mockRejectedValue(new Error('Failed to load projects'));

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectProvider>
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </ProjectProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText('Failed to load projects')
    ).toBeInTheDocument();
  });

  it('shows empty state when no projects are returned', async () => {
    projectsApi.getAll.mockResolvedValue({
      data: {
        projects: [],
      },
    });

    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectProvider>
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </ProjectProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByText('No projects yet. Create your first one!')
    ).toBeInTheDocument();
  });
});
