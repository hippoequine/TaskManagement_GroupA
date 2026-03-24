// @vitest-environment jsdom

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../context/ProjectContext', () => ({
  useProject: vi.fn(),
}));

vi.mock('react-router', () => ({
  Outlet: ({ context }) => (
    <div data-testid="outlet">{context?.project?.name ?? 'no-project'}</div>
  ),
}));

import Project from '../pages/Project';
import { useProject } from '../context/ProjectContext';

describe('Project (layout)', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders outlet when loading but no project yet (skeleton state)', () => {
    useProject.mockReturnValue({ currentProject: null, loading: true });
    render(<Project />);
    expect(screen.getByTestId('outlet')).toBeDefined();
  });

  it('renders error alert when project is not found and not loading', () => {
    useProject.mockReturnValue({ currentProject: null, loading: false });
    render(<Project />);
    expect(screen.getByText('Project not found')).toBeDefined();
  });

  it('renders outlet with project context when project is found', () => {
    const fakeProject = { id: 'abc', name: 'My Project' };
    useProject.mockReturnValue({ currentProject: fakeProject, loading: false });
    render(<Project />);
    expect(screen.getByTestId('outlet')).toBeDefined();
    expect(screen.getByText('My Project')).toBeDefined();
  });
});
