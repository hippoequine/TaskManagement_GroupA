// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../components/Attachment', () => ({
  default: () => <div data-testid="attachment" />,
}));

vi.mock('../context/ProjectContext', () => ({
  useProject: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useOutletContext: vi.fn(),
}));

vi.mock('../api/projectsApi', () => ({
  projectsApi: {
    update: vi.fn(),
  },
}));

import ProjectDetailsPage from '../pages/ProjectDetailsPage';
import { useProject } from '../context/ProjectContext';
import { useOutletContext } from 'react-router';
import { projectsApi } from '../api/projectsApi';

const baseProject = {
  id: 'abc-123',
  name: 'Existing Project',
  key: 'EXIST',
  description: 'An existing project.',
  category: 'Maintenance',
  status: 'active',
};

describe('ProjectDetailsPage', () => {
  const mockSetProjects = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useProject.mockReturnValue({ setProjects: mockSetProjects });
    useOutletContext.mockReturnValue({ project: baseProject });
  });

  it('renders the page title', () => {
    render(<ProjectDetailsPage />);
    expect(screen.getByText('Project Details')).toBeDefined();
  });

  it('pre-fills the name field with the existing project name', () => {
    render(<ProjectDetailsPage />);
    const nameInput = screen.getByLabelText(/Project Name/i);
    expect(nameInput.value).toBe('Existing Project');
  });

  it('pre-fills the key field with the existing project key', () => {
    render(<ProjectDetailsPage />);
    const keyInput = screen.getByLabelText(/Project Key/i);
    expect(keyInput.value).toBe('EXIST');
  });

  it('uppercases key input as user types', () => {
    render(<ProjectDetailsPage />);
    const keyInput = screen.getByLabelText(/Project Key/i);
    fireEvent.change(keyInput, { target: { value: 'newkey' } });
    expect(keyInput.value).toBe('NEWKEY');
  });

  it('shows validation error when name is cleared and Save is clicked', async () => {
    render(<ProjectDetailsPage />);
    const nameInput = screen.getByLabelText(/Project Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(await screen.findByText('Project name is required.')).toBeDefined();
  });

  it('shows validation error when key is cleared and Save is clicked', async () => {
    render(<ProjectDetailsPage />);
    const keyInput = screen.getByLabelText(/Project Key/i);
    fireEvent.change(keyInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(await screen.findByText('Project key is required.')).toBeDefined();
  });

  it('calls projectsApi.update with correct payload on save', async () => {
    projectsApi.update.mockResolvedValue({
      data: { ...baseProject, name: 'Updated Name' },
    });

    render(<ProjectDetailsPage />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'Updated Name' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await screen.findByRole('button', { name: /Save Changes/i });

    expect(projectsApi.update).toHaveBeenCalledWith(
      'abc-123',
      expect.objectContaining({ name: 'Updated Name' })
    );
  });

  it('navigates back to project on successful save', async () => {
    projectsApi.update.mockResolvedValue({
      data: { ...baseProject },
    });

    render(<ProjectDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await screen.findByRole('button', { name: /Save Changes/i });

    expect(mockNavigate).toHaveBeenCalledWith('/projects/abc-123');
  });

  it('shows error message on failed save', async () => {
    projectsApi.update.mockRejectedValue(new Error('Server error'));

    render(<ProjectDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    expect(await screen.findByText('Failed to save changes.')).toBeDefined();
  });

  it('navigates back on Cancel click', () => {
    render(<ProjectDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/abc-123');
  });

  it('allows editing the description field', () => {
    render(<ProjectDetailsPage />);
    const descInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descInput, { target: { value: 'Updated description' } });
    expect(descInput.value).toBe('Updated description');
  });

  it('changes category via select', () => {
    render(<ProjectDetailsPage />);
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[0]);
    fireEvent.click(screen.getByRole('option', { name: 'New Development' }));
    expect(comboboxes[0].textContent).toContain('New Development');
  });

  it('changes status via select', () => {
    render(<ProjectDetailsPage />);
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[1]);
    fireEvent.click(screen.getByRole('option', { name: 'Completed' }));
    expect(comboboxes[1].textContent).toContain('Completed');
  });

  it('calls setProjects updater that maps updated project into list', async () => {
    const updatedProject = { ...baseProject, name: 'Updated' };
    let capturedUpdater = null;
    useProject.mockReturnValue({
      setProjects: vi.fn((fn) => {
        if (typeof fn === 'function') {
          capturedUpdater = fn;
          fn([baseProject]);
        }
      }),
    });
    projectsApi.update.mockResolvedValue({ data: updatedProject });

    render(<ProjectDetailsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await screen.findByRole('button', { name: /Save Changes/i });
    expect(capturedUpdater).not.toBeNull();
    const result = capturedUpdater([baseProject]);
    expect(result[0]).toEqual(updatedProject);
  });
});
