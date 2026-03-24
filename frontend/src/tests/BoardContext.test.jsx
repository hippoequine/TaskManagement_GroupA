// @vitest-environment jsdom
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BoardProvider, useBoard } from '../context/BoardContext';
import { boardsApi } from '../api/boardsApi';

let mockProjectState;
let mockMatch;
const mockNavigate = vi.fn();

vi.mock('../context/ProjectContext', () => ({
  useProject: () => mockProjectState,
}));

vi.mock('../api/boardsApi', () => ({
  boardsApi: {
    getAll: vi.fn(),
  },
}));

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useMatch: () => mockMatch,
}));

function Consumer() {
  const { boards, currentBoard, loading, error, fetchBoards, switchBoard } =
    useBoard();

  return (
    <div>
      <div data-testid="boards-count">{boards?.length ?? 0}</div>
      <div data-testid="current-board-id">{currentBoard?.id ?? ''}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? ''}</div>

      <button type="button" onClick={() => fetchBoards()}>
        Refetch
      </button>

      <button type="button" onClick={() => switchBoard({ id: 'b2' })}>
        SwitchToB2
      </button>
    </div>
  );
}

describe('BoardContext / BoardProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatch = null;
    mockProjectState = { currentProject: null };
  });

  it('does not fetch boards when there is no currentProject.id', async () => {
    render(
      <BoardProvider>
        <Consumer />
      </BoardProvider>
    );

    expect(boardsApi.getAll).not.toHaveBeenCalled();
    expect(screen.getByTestId('boards-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('fetches boards on mount when project id exists', async () => {
    mockProjectState = { currentProject: { id: 'proj-1' } };
    boardsApi.getAll.mockResolvedValueOnce({
      data: [
        { id: 'b1', title: 'One' },
        { id: 'b2', title: 'Two' },
      ],
    });

    render(
      <BoardProvider>
        <Consumer />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(boardsApi.getAll).toHaveBeenCalledWith('proj-1');
    });

    await waitFor(() => {
      expect(screen.getByTestId('boards-count')).toHaveTextContent('2');
    });
  });

  it('derives currentBoard from URL boardId param', async () => {
    mockProjectState = { currentProject: { id: 'proj-1' } };
    mockMatch = { params: { boardId: 'b2' } };

    boardsApi.getAll.mockResolvedValueOnce({
      data: [
        { id: 'b1', title: 'One' },
        { id: 'b2', title: 'Two' },
      ],
    });

    render(
      <BoardProvider>
        <Consumer />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-board-id')).toHaveTextContent('b2');
    });
  });

  it('sets error when fetchBoards fails', async () => {
    mockProjectState = { currentProject: { id: 'proj-1' } };
    boardsApi.getAll.mockRejectedValueOnce(new Error('nope'));

    render(
      <BoardProvider>
        <Consumer />
      </BoardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('nope');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('switchBoard navigates to the board route', async () => {
    mockProjectState = { currentProject: { id: 'proj-1' } };
    boardsApi.getAll.mockResolvedValueOnce({ data: [] });

    const user = userEvent.setup();
    render(
      <BoardProvider>
        <Consumer />
      </BoardProvider>
    );

    await user.click(screen.getByRole('button', { name: /switchtob2/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1/board/b2');
  });
});
