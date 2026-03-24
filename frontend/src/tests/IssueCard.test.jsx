// @vitest-environment jsdom
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IssueCard from '../components/issue-card/IssueCard';

const mockUpdateIssue = vi.fn();

vi.mock('../context/IssuesContext.jsx', () => ({
  useIssues: () => ({ updateIssue: mockUpdateIssue }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: () => 'translate3d(0px, 0px, 0px)',
    },
  },
}));

vi.mock('../components/issue-card/StoryPoints.jsx', () => ({
  default: ({ points, onChange }) => (
    <label>
      StoryPoints
      <input
        aria-label="Story points input"
        defaultValue={points}
        onChange={onChange}
      />
    </label>
  ),
}));

vi.mock('../components/issue-card/Assignee.jsx', () => ({
  default: ({ name, onSelect }) => (
    <div>
      <div>AssigneeName:{name ?? ''}</div>
      <button
        type="button"
        onClick={() => onSelect({ id: 'u1', fullName: 'John Doe' })}
      >
        AssignJohn
      </button>
      <button type="button" onClick={() => onSelect(null)}>
        Unassign
      </button>
    </div>
  ),
}));

describe('IssueCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders issue title and description', () => {
    const issue = {
      id: 'i1',
      title: 'Fix login bug',
      description: 'Steps to reproduce...',
      type: 'bug',
      storyPoints: 3,
      assignees: [],
    };

    render(<IssueCard issue={issue} onViewClick={vi.fn()} />);

    expect(screen.getAllByText('Fix login bug')).toHaveLength(2);
    expect(screen.getByText('Steps to reproduce...')).toBeInTheDocument();
  });

  it('clicking view icon calls onViewClick(issue) and does not bubble', async () => {
    const user = userEvent.setup();
    const onViewClick = vi.fn();
    const onOuterClick = vi.fn();

    const issue = {
      id: 'i1',
      title: 'Fix login bug',
      description: 'Steps to reproduce...',
      type: 'bug',
      storyPoints: 3,
      assignees: [],
    };

    render(
      <div onClick={onOuterClick}>
        <IssueCard issue={issue} onViewClick={onViewClick} />
      </div>
    );

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);

    expect(onViewClick).toHaveBeenCalledTimes(1);
    expect(onViewClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'i1' })
    );

    expect(onOuterClick).not.toHaveBeenCalled();
  });

  it('changing story points calls updateIssue with parsed integer', async () => {
    const user = userEvent.setup();

    const issue = {
      id: 'i1',
      title: 'Fix login bug',
      description: 'Steps to reproduce...',
      type: 'bug',
      storyPoints: 3,
      assignees: [],
    };

    render(<IssueCard issue={issue} onViewClick={vi.fn()} />);

    const input = screen.getByLabelText(/story points input/i);
    await user.clear(input);
    await user.type(input, '5');

    expect(mockUpdateIssue).toHaveBeenCalledWith('i1', { storyPoints: 5 });
  });

  it('assigning and unassigning calls updateIssue with assigneeIds', async () => {
    const user = userEvent.setup();

    const issue = {
      id: 'i1',
      title: 'Fix login bug',
      description: 'Steps to reproduce...',
      type: 'bug',
      storyPoints: 3,
      assignees: [],
    };

    render(<IssueCard issue={issue} onViewClick={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assignjohn/i }));
    expect(mockUpdateIssue).toHaveBeenCalledWith('i1', { assigneeIds: ['u1'] });

    await user.click(screen.getByRole('button', { name: /unassign/i }));
    expect(mockUpdateIssue).toHaveBeenCalledWith('i1', { assigneeIds: [] });
  });

  it('derives assignee name from first entry in issue.assignees', () => {
    const issue = {
      id: 'i1',
      title: 'Fix login bug',
      description: 'Steps to reproduce...',
      type: 'bug',
      storyPoints: 3,
      assignees: [{ id: 'u9', firstName: 'Grace', lastName: 'Hopper' }],
    };

    render(<IssueCard issue={issue} onViewClick={vi.fn()} />);

    expect(screen.getByText(/assigneename:grace hopper/i)).toBeInTheDocument();
  });
});
