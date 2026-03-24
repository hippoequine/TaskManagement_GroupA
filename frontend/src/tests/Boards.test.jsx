// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BoardsPage from '../pages/Boards';

// Router mocks
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

// Context mocks – use mutable values so each test can customize quickly
let boardState;
let projectState;

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

vi.mock('../context/BoardContext', () => ({
  useBoard: () => boardState,
}));

vi.mock('../context/ProjectContext', () => ({
  useProject: () => projectState,
}));

describe('BoardsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockUseParams.mockReturnValue({ projectId: 'proj-1' });

    projectState = {
      currentProject: { id: 'proj-1', name: 'Alpha' },
    };

    boardState = {
      boards: [],
      loading: false,
      error: '',
    };
  });

  it('renders heading and Create Board button', () => {
    render(<BoardsPage />);

    expect(
      screen.getByRole('heading', { name: /boards/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create board/i })
    ).toBeInTheDocument();
  });

  it('navigates to create board page when Create Board is clicked', async () => {
    const user = userEvent.setup();
    render(<BoardsPage />);

    await user.click(screen.getByRole('button', { name: /create board/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1/board/create');
  });

  it('shows loading spinner when loading', () => {
    boardState = { boards: [], loading: true, error: '' };
    render(<BoardsPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error banner when context error is present', () => {
    boardState = { boards: [], loading: false, error: 'Error' };
    render(<BoardsPage />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('shows empty state when there are no boards', () => {
    boardState = { boards: [], loading: false, error: '' };
    render(<BoardsPage />);

    expect(screen.getByText(/no boards yet/i)).toBeInTheDocument();
  });

  it('filters boards by search query and shows "no match" state', async () => {
    boardState = {
      loading: false,
      error: '',
      boards: [
        { id: 'b1', title: 'Frontend', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'b2', title: 'Backend', createdAt: '2024-01-01T00:00:00.000Z' },
      ],
    };

    const user = userEvent.setup();
    render(<BoardsPage />);

    const search = screen.getByPlaceholderText(/search boards in alpha/i);
    await user.type(search, 'does-not-exist');

    expect(
      screen.getByText(/no boards match your search/i)
    ).toBeInTheDocument();
  });

  it('navigates to board details when a row is clicked', async () => {
    boardState = {
      loading: false,
      error: '',
      boards: [{ id: 'b1', title: 'Frontend', createdAt: null }],
    };

    const user = userEvent.setup();
    render(<BoardsPage />);

    // Click the cell text; that will bubble to the TableRow onClick
    await user.click(screen.getByText('Frontend'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/proj-1/board/b1');
  });

  it('stars a board and persists it to localStorage without navigating', async () => {
    boardState = {
      loading: false,
      error: '',
      boards: [{ id: 'b1', title: 'Frontend', createdAt: null }],
    };

    const user = userEvent.setup();
    render(<BoardsPage />);

    const rowText = screen.getByText('Frontend');
    const row = rowText.closest('tr');
    expect(row).not.toBeNull();

    const buttonsInRow = row.querySelectorAll('button');
    expect(buttonsInRow.length).toBeGreaterThan(0);

    await user.click(buttonsInRow[0]);

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(JSON.parse(localStorage.getItem('jiro:starredBoards'))).toEqual([
      'b1',
    ]);
  });
});
