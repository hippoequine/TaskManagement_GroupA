// @vitest-environment jsdom
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Assignee from '../components/issue-card/Assignee';

let mockUsersState;

vi.mock('../context/UsersContext', () => ({
  useUsers: () => mockUsersState,
}));

describe('Assignee', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsersState = { users: [], loading: false, error: null };
  });

  it('renders the assign button', () => {
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /assign user/i })
    ).toBeInTheDocument();
  });

  it('opens popover and shows search input', async () => {
    const user = userEvent.setup();
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    expect(
      await screen.findByPlaceholderText(/search users/i)
    ).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    mockUsersState = { users: [], loading: true };

    const user = userEvent.setup();
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    expect(await screen.findByText(/loading users/i)).toBeInTheDocument();
  });

  it('shows no users found when list is empty', async () => {
    mockUsersState = { users: [], loading: false };

    const user = userEvent.setup();
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });

  it('filters users by query', async () => {
    mockUsersState = {
      loading: false,
      users: [
        { id: 'u1', fullName: 'John Johnname', email: 'j@j.com' },
        { id: 'u2', fullName: 'Other Person', email: 'somewhere@google.com' },
      ],
    };

    const user = userEvent.setup();
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    const search = await screen.findByPlaceholderText(/search users/i);
    expect(screen.getByText('John Johnname')).toBeInTheDocument();
    expect(screen.getByText('Other Person')).toBeInTheDocument();

    await user.type(search, 'other');

    expect(screen.queryByText('John Johnname')).not.toBeInTheDocument();
    expect(screen.getByText('Other Person')).toBeInTheDocument();
  });

  it('selects a user, calls onSelect(user), and closes the popover', async () => {
    mockUsersState = {
      loading: false,
      users: [{ id: 'u1', fullName: 'John Johnname', email: 'j@j.com' }],
    };

    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<Assignee name="" selectedId={null} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    await user.click(await screen.findByText('John Johnname'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'u1', fullName: 'John Johnname' })
    );

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(/search users/i)
      ).not.toBeInTheDocument();
    });
  });

  it('shows Unassign option when selectedId is not null and unassigns on click', async () => {
    mockUsersState = {
      loading: false,
      users: [{ id: 'u1', fullName: 'John Johnname', email: 'j@j.com' }],
    };

    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <Assignee name="John Johnname" selectedId="u1" onSelect={onSelect} />
    );

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    // Unassign row exists only when selectedId !== null
    await user.click(await screen.findByText(/unassign/i));

    expect(onSelect).toHaveBeenCalledWith(null);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(/search users/i)
      ).not.toBeInTheDocument();
    });
  });

  it('clears the query with the Clear button', async () => {
    mockUsersState = {
      loading: false,
      users: [
        { id: 'u1', fullName: 'John Johnname', email: 'j@j.com' },
        { id: 'u2', fullName: 'Other Person', email: 'somewhere@google.com' },
      ],
    };

    const user = userEvent.setup();
    render(<Assignee name="" selectedId={null} onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /assign user/i }));

    const search = await screen.findByPlaceholderText(/search users/i);
    await user.type(search, 'other');

    // Clear button appears only when query has value
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(search).toHaveValue('');
    expect(screen.getByText('John Johnname')).toBeInTheDocument();
    expect(screen.getByText('Other Person')).toBeInTheDocument();
  });
});
