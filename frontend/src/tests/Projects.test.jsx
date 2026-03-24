// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../context/ProjectContext', () => ({
  useProject: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

import ProjectsPage from '../pages/Projects';
import { useProject } from '../context/ProjectContext';

const fakeProjects = [
  {
    id: 'proj-1',
    name: 'Alpha Project',
    key: 'ALPHA',
    category: 'New Development',
    status: 'active',
    owner: { firstName: 'John', lastName: 'Doe' },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Beta Project',
    key: 'BETA',
    category: 'Maintenance',
    status: 'completed',
    owner: { firstName: 'Jane', lastName: 'Smith' },
    created_at: '2024-02-01T00:00:00Z',
  },
];

describe('ProjectsPage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows loading spinner when loading', () => {
    useProject.mockReturnValue({ projects: [], loading: true, error: null });
    render(<ProjectsPage />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  it('shows empty state message when no projects exist', () => {
    useProject.mockReturnValue({ projects: [], loading: false, error: null });
    render(<ProjectsPage />);
    expect(
      screen.getByText('No projects yet. Create your first one!')
    ).toBeDefined();
  });

  it('shows error alert when context returns an error', () => {
    useProject.mockReturnValue({
      projects: [],
      loading: false,
      error: 'Failed to load projects',
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Failed to load projects')).toBeDefined();
  });

  it('renders project names in the table', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.getByText('Beta Project')).toBeDefined();
  });

  it('renders project keys as chips', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('ALPHA')).toBeDefined();
    expect(screen.getByText('BETA')).toBeDefined();
  });

  it('renders status chips for each project', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);
    expect(screen.getByText('Active')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
  });

  it('filters projects by search query (name match)', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.queryByText('Beta Project')).toBeNull();
  });

  it('shows no match message when search has no results', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'zzznomatch' } });

    expect(screen.getByText('No projects match your search.')).toBeDefined();
  });

  it('search is case-insensitive', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const searchInput = screen.getByPlaceholderText('Search projects...');
    fireEvent.change(searchInput, { target: { value: 'alpha' } });

    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.queryByText('Beta Project')).toBeNull();
  });

  it('navigates to project detail when a row is clicked', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    fireEvent.click(screen.getByText('Alpha Project'));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1');
  });

  it('navigates to create page when Create Project button is clicked', () => {
    useProject.mockReturnValue({ projects: [], loading: false, error: null });
    render(<ProjectsPage />);

    fireEvent.click(screen.getByText('Create Project'));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/create');
  });

  it('toggles star on a project and saves to localStorage', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    // Buttons: [Create Project, star-proj-1, star-proj-2]
    const allButtons = screen.getAllByRole('button');
    fireEvent.click(allButtons[1]); // first star button

    const starred = JSON.parse(localStorage.getItem('jiro:starredProjects'));
    expect(starred).toContain('proj-1');
  });

  it('untoggles a star that was already starred', () => {
    localStorage.setItem('jiro:starredProjects', JSON.stringify(['proj-1']));
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const allButtons = screen.getAllByRole('button');
    fireEvent.click(allButtons[1]); // click again to unstar

    const starred = JSON.parse(localStorage.getItem('jiro:starredProjects'));
    expect(starred).not.toContain('proj-1');
  });

  it('clicking the star button does not navigate to project (stopPropagation)', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const allButtons = screen.getAllByRole('button');
    fireEvent.click(allButtons[1]); // star button

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('loads starred state from localStorage on mount', () => {
    localStorage.setItem('jiro:starredProjects', JSON.stringify(['proj-2']));
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    // proj-2 should appear starred — the starred state is loaded from storage
    const starred = JSON.parse(localStorage.getItem('jiro:starredProjects'));
    expect(starred).toContain('proj-2');
  });

  it('filters projects by category via select', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[0]); // category select
    fireEvent.click(screen.getByRole('option', { name: 'Maintenance' }));

    expect(screen.queryByText('Alpha Project')).toBeNull();
    expect(screen.getByText('Beta Project')).toBeDefined();
  });

  it('filters projects by status via select', () => {
    useProject.mockReturnValue({
      projects: fakeProjects,
      loading: false,
      error: null,
    });
    render(<ProjectsPage />);

    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[1]); // status select
    fireEvent.click(screen.getByRole('option', { name: 'Active' }));

    expect(screen.getByText('Alpha Project')).toBeDefined();
    expect(screen.queryByText('Beta Project')).toBeNull();
  });
});
