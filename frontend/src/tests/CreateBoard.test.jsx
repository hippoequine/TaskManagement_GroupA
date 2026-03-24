// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import * as userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { boardsApi } from '../api/boardsApi';
import CreateBoard from '../pages/CreateBoard';

const mockNavigate = vi.fn();
const mockFetchBoards = vi.fn();
const mockFetchProjects = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock('../context/BoardContext', () => ({
  useBoard: () => ({
    fetchBoards: mockFetchBoards,
  }),
}));

vi.mock('../context/ProjectContext', () => ({
  useProject: () => ({
    fetchProjects: mockFetchProjects,
    currentProject: { id: 'proj-1' },
  }),
}));

vi.mock('../api/boardsApi', () => ({
  boardsApi: {
    create: vi.fn(),
  },
}));

describe('CreateBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading, input, and buttons', () => {
    render(<CreateBoard />);

    expect(
      screen.getByRole('heading', { name: /create board/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/board title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create board/i })
    ).toBeInTheDocument();
  });

  it('shows validation error if title is empty and does not call API', async () => {
    const user = userEvent.setup();
    render(<CreateBoard />);

    await user.click(screen.getByRole('button', { name: /create board/i }));

    expect(
      await screen.findByText(/board title is required/i)
    ).toBeInTheDocument();
    expect(boardsApi.create).not.toHaveBeenCalled();
  });

  it('creates board successfully, refreshes data, then navigates on Done', async () => {
    boardsApi.create.mockResolvedValueOnce({
      data: { id: 'board-123', title: 'My Board' },
    });

    const user = userEvent.setup();
    render(<CreateBoard />);

    const titleInput = screen.getByLabelText(/board title/i);
    await user.type(titleInput, '  My Board  ');

    await user.click(screen.getByRole('button', { name: /create board/i }));

    await waitFor(() => {
      expect(boardsApi.create).toHaveBeenCalledWith({
        projectId: 'proj-1',
        title: 'My Board',
      });
    });

    expect(mockFetchBoards).toHaveBeenCalledTimes(1);
    expect(mockFetchProjects).toHaveBeenCalledTimes(1);

    // after creation, Create Board button is replaced by Done
    const doneButton = await screen.findByRole('button', { name: /done/i });
    await user.click(doneButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/projects/proj-1/board/board-123'
    );
  });

  it('navigates to boards list when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateBoard />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1/boards');
  });

  it('shows API error message when create fails', async () => {
    boardsApi.create.mockRejectedValueOnce({
      response: { data: { error: 'Nope' } },
    });

    const user = userEvent.setup();
    render(<CreateBoard />);

    await user.type(screen.getByLabelText(/board title/i), 'Board X');
    await user.click(screen.getByRole('button', { name: /create board/i }));

    expect(await screen.findByText('Nope')).toBeInTheDocument();
    expect(mockFetchBoards).not.toHaveBeenCalled();
    expect(mockFetchProjects).not.toHaveBeenCalled();

    // still shows Create Board (no Done yet)
    expect(
      screen.getByRole('button', { name: /create board/i })
    ).toBeInTheDocument();
  });
});
