// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Board from '../pages/Board';

let boardState;
let issuesState;
let outletContext;

vi.mock('react-router', () => ({
  Link: ({ to, children, ...rest }) => (
    <a href={typeof to === 'string' ? to : ''} {...rest}>
      {children}
    </a>
  ),
  useOutletContext: () => outletContext,
}));

vi.mock('../context/BoardContext.jsx', () => ({
  useBoard: () => boardState,
}));

vi.mock('../context/IssuesContext.jsx', () => ({
  useIssues: () => issuesState,
}));

vi.mock('../context/BoardDndContext.jsx', () => ({
  BoardDndProvider: ({ children }) => (
    <div data-testid="dnd-provider">{children}</div>
  ),
  useBoardDnd: () => ({ activeIssue: null }),
  isValidTransition: () => true,
}));

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }) => (
    <div data-testid="sortable">{children}</div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock('../components/issue-card/IssueCard.jsx', () => ({
  default: ({ issue, onViewClick }) => (
    <div>
      <div>{issue.title}</div>
      <button type="button" onClick={() => onViewClick(issue)}>
        View
      </button>
    </div>
  ),
}));

vi.mock('../components/IssueForm/CreateIssueForm.jsx', () => ({
  default: ({ onIssueCreation }) => (
    <button type="button" onClick={() => onIssueCreation()}>
      Mock Submit CreateIssueForm
    </button>
  ),
}));

vi.mock('../components/IssueForm/ViewIssue.jsx', () => ({
  default: ({ issue, onClose, onDelete, onEditSuccess }) => (
    <div>
      <div>Viewing: {issue.title}</div>
      <button type="button" onClick={onClose}>
        Close
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
      <button type="button" onClick={onEditSuccess}>
        EditSuccess
      </button>
    </div>
  ),
}));

describe('Board page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    outletContext = {
      project: { id: 'proj-1', name: 'Alpha' },
    };

    boardState = {
      currentBoard: {
        id: 'board-1',
        title: 'Sprint Board',
      },
    };

    issuesState = {
      issues: [
        { id: 'i1', title: 'Fix bug', status: 'backlog' },
        { id: 'i2', title: 'Add feature', status: 'in_progress' },
      ],
      fetchIssues: vi.fn(),
      deleteIssue: vi.fn().mockResolvedValue(undefined),
      error: null,
      setError: vi.fn(),
    };
  });

  it('renders Board Not Found when there is no currentBoard', () => {
    boardState = { currentBoard: null };

    render(<Board />);

    expect(
      screen.getByRole('heading', { name: /board not found/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to boards list/i })
    ).toHaveAttribute('href', '/projects/proj-1/board');
  });

  it('renders header with project and board title and shows columns + issues', () => {
    render(<Board />);

    expect(screen.getByRole('link', { name: /alpha/i })).toBeInTheDocument();
    expect(screen.getByText(/\/ sprint board/i)).toBeInTheDocument();

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.getByText('Add feature')).toBeInTheDocument();
  });

  it('filters issues by search query', async () => {
    const user = userEvent.setup();
    render(<Board />);

    await user.type(screen.getByPlaceholderText(/search issues/i), 'fix');

    expect(screen.getByText('Fix bug')).toBeInTheDocument();
    expect(screen.queryByText('Add feature')).not.toBeInTheDocument();
  });

  it('opens Create Issue dialog and calls fetchIssues after creation', async () => {
    const user = userEvent.setup();
    render(<Board />);

    await user.click(screen.getByRole('button', { name: /^create issue$/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/^create issue$/i)).toBeInTheDocument();

    // click the mocked submit button inside the dialog
    await user.click(
      within(dialog).getByRole('button', {
        name: /mock submit createissueform/i,
      })
    );

    expect(issuesState.fetchIssues).toHaveBeenCalledTimes(1);
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('opens ViewIssue dialog via IssueCard and supports delete flow', async () => {
    const user = userEvent.setup();
    render(<Board />);

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    await user.click(viewButtons[0]);

    expect(await screen.findByText(/viewing:/i)).toHaveTextContent(
      'Viewing: Fix bug'
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(issuesState.deleteIssue).toHaveBeenCalledWith('i1');
    expect(issuesState.fetchIssues).toHaveBeenCalledTimes(1);

    expect(screen.queryByText(/viewing:/i)).not.toBeInTheDocument();
  });

  it('handles edit success by refreshing issues and closing dialog', async () => {
    const user = userEvent.setup();
    render(<Board />);

    await user.click(screen.getAllByRole('button', { name: /view/i })[0]);
    expect(await screen.findByText(/viewing:/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /editsuccess/i }));

    expect(issuesState.fetchIssues).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/viewing:/i)).not.toBeInTheDocument();
  });

  it('shows error toast when issues context has error and clears it on close', async () => {
    const user = userEvent.setup();

    issuesState = {
      ...issuesState,
      error: 'Drag failed',
    };

    render(<Board />);

    expect(await screen.findByText('Drag failed')).toBeInTheDocument();

    const alert =
      screen.getByText('Drag failed').closest('[role="alert"]') ||
      screen.getByText('Drag failed').parentElement;
    const closeBtn = alert ? within(alert).queryByRole('button') : null;
    if (closeBtn) {
      await user.click(closeBtn);
    } else {
      await user.click(screen.getByText('Drag failed'));
    }

    expect(issuesState.setError).toHaveBeenCalledWith(null);
  });
});
