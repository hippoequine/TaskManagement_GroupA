// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('react-router', () => ({
  useOutletContext: vi.fn(),
  useParams: vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('../components/Attachment', () => ({
  default: () => <div data-testid="attachment" />,
}));

vi.mock('../components/ProjectFieldsDisplay', () => ({
  default: ({ project }) => (
    <div data-testid="project-fields">
      {project.description || 'No description provided for this project.'}
    </div>
  ),
}));

import ProjectOverview from '../pages/ProjectOverview';
import { useOutletContext } from 'react-router';

const baseProject = {
  id: 'abc',
  name: 'Test Project',
  key: 'TEST',
  status: 'active',
  description: 'A test project description.',
  owner: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
};

describe('ProjectOverview', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the project name', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText('Test Project')).toBeDefined();
  });

  it('renders the project key', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText('Key: TEST')).toBeDefined();
  });

  it('shows Active status chip for active projects', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText('Active')).toBeDefined();
  });

  it('shows Completed status chip for completed projects', () => {
    useOutletContext.mockReturnValue({
      project: { ...baseProject, status: 'completed' },
    });
    render(<ProjectOverview />);
    expect(screen.getByText('Completed')).toBeDefined();
  });

  it('renders the owner name', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText(/John/)).toBeDefined();
    expect(screen.getByText(/Doe/)).toBeDefined();
  });

  it('renders the project description', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText('A test project description.')).toBeDefined();
  });

  it('shows fallback text when description is empty', () => {
    useOutletContext.mockReturnValue({
      project: { ...baseProject, description: '' },
    });
    render(<ProjectOverview />);
    expect(
      screen.getByText('No description provided for this project.')
    ).toBeDefined();
  });

  it('does not render owner section when owner is null', () => {
    useOutletContext.mockReturnValue({
      project: { ...baseProject, owner: null },
    });
    render(<ProjectOverview />);
    expect(screen.queryByText(/John/)).toBeNull();
  });

  it('renders Edit Details and Go to Boards buttons', () => {
    useOutletContext.mockReturnValue({ project: baseProject });
    render(<ProjectOverview />);
    expect(screen.getByText('Edit Details')).toBeDefined();
    expect(screen.getByText('Go to Boards')).toBeDefined();
  });
});
