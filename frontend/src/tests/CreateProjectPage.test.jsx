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
}));

vi.mock('../api/projectsApi', () => ({
  projectsApi: {
    create: vi.fn(),
  },
}));

import CreateProjectPage from '../pages/CreateProjectPage';
import { useProject } from '../context/ProjectContext';
import { projectsApi } from '../api/projectsApi';

describe('CreateProjectPage', () => {
  const mockSetProjects = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useProject.mockReturnValue({ setProjects: mockSetProjects });
  });

  it('renders the page title', () => {
    render(<CreateProjectPage />);
    expect(
      screen.getByRole('heading', { name: /Create Project/i })
    ).toBeDefined();
  });

  it('renders the project name and key fields', () => {
    render(<CreateProjectPage />);
    expect(screen.getByLabelText(/Project Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Project Key/i)).toBeDefined();
  });

  it('renders the Create Project submit button', () => {
    render(<CreateProjectPage />);
    expect(
      screen.getByRole('button', { name: /Create Project/i })
    ).toBeDefined();
  });

  it('shows validation error when submitting without a name', async () => {
    render(<CreateProjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));
    expect(await screen.findByText('Project name is required.')).toBeDefined();
  });

  it('shows validation error when submitting without a key', async () => {
    render(<CreateProjectPage />);
    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));
    expect(await screen.findByText('Project key is required.')).toBeDefined();
  });

  it('calls projectsApi.create with correct payload on valid submit', async () => {
    projectsApi.create.mockResolvedValue({
      data: { id: 'new-id', name: 'My Project', key: 'MYPR' },
    });

    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Key/i), {
      target: { value: 'mypr' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    expect(await screen.findByRole('button', { name: /Done/i })).toBeDefined();
    expect(projectsApi.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'My Project', key: 'MYPR' })
    );
  });

  it('uppercases the project key as user types', () => {
    render(<CreateProjectPage />);
    const keyInput = screen.getByLabelText(/Project Key/i);
    fireEvent.change(keyInput, { target: { value: 'myproject' } });
    expect(keyInput.value).toBe('MYPROJECT');
  });

  it('shows API error message on failed create', async () => {
    projectsApi.create.mockRejectedValue({
      response: { data: { error: 'Key already in use.' } },
    });

    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Key/i), {
      target: { value: 'PROJ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    expect(await screen.findByText('Key already in use.')).toBeDefined();
  });

  it('navigates to /projects when Cancel is clicked', () => {
    render(<CreateProjectPage />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('navigates to /projects when Done is clicked after creation', async () => {
    projectsApi.create.mockResolvedValue({
      data: { id: 'new-id', name: 'My Project', key: 'MYPR' },
    });

    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Key/i), {
      target: { value: 'MYPR' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    const doneBtn = await screen.findByRole('button', { name: /Done/i });
    fireEvent.click(doneBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/projects');
  });

  it('allows typing in description field', () => {
    render(<CreateProjectPage />);
    const descInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descInput, {
      target: { value: 'My project description' },
    });
    expect(descInput.value).toBe('My project description');
  });

  it('changes category via select', () => {
    render(<CreateProjectPage />);
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[0]);
    fireEvent.click(screen.getByRole('option', { name: 'New Development' }));
    expect(comboboxes[0].textContent).toContain('New Development');
  });

  it('changes status via select', () => {
    render(<CreateProjectPage />);
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.mouseDown(comboboxes[1]);
    fireEvent.click(screen.getByRole('option', { name: 'Completed' }));
    expect(comboboxes[1].textContent).toContain('Completed');
  });

  it('calls setProjects updater function with new project prepended', async () => {
    const fakeProject = { id: 'new-id', name: 'My Project', key: 'MYPR' };
    let capturedUpdater = null;
    useProject.mockReturnValue({
      setProjects: vi.fn((fn) => {
        if (typeof fn === 'function') {
          capturedUpdater = fn;
          fn([]);
        }
      }),
    });
    projectsApi.create.mockResolvedValue({ data: fakeProject });

    render(<CreateProjectPage />);
    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Key/i), {
      target: { value: 'MYPR' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    await screen.findByRole('button', { name: /Done/i });
    expect(capturedUpdater).not.toBeNull();
    expect(capturedUpdater([])).toEqual([fakeProject]);
  });

  it('shows generic error message when API error has no message', async () => {
    projectsApi.create.mockRejectedValue(new Error('Network error'));

    render(<CreateProjectPage />);
    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'My Project' },
    });
    fireEvent.change(screen.getByLabelText(/Project Key/i), {
      target: { value: 'PROJ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    expect(
      await screen.findByText('Failed to create project. Please try again.')
    ).toBeDefined();
  });
});
