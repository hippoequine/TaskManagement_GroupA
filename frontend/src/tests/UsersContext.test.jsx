// @vitest-environment jsdom
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UsersProvider, useUsers } from '../context/UsersContext';
import { usersApi } from '../api/usersApi';

vi.mock('../api/usersApi', () => ({
  usersApi: {
    getAll: vi.fn(),
  },
}));

function Consumer() {
  const { users, loading, error, fetchUsers } = useUsers();

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error ?? ''}</div>
      <div data-testid="count">{users?.length ?? 0}</div>

      <ul>
        {(users || []).map((u) => (
          <li key={u.id}>{u.name ?? u.email ?? String(u.id)}</li>
        ))}
      </ul>

      <button type="button" onClick={() => fetchUsers()}>
        Refetch
      </button>
    </div>
  );
}

describe('UsersContext / UsersProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches users on mount and exposes them to consumers', async () => {
    usersApi.getAll.mockResolvedValueOnce({
      data: [
        { id: 'u1', name: 'Ada' },
        { id: 'u2', name: 'Linus' },
      ],
    });

    render(
      <UsersProvider>
        <Consumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(usersApi.getAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('2');
    });

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Linus')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('defaults to an empty array when API returns no data', async () => {
    usersApi.getAll.mockResolvedValueOnce({ data: null });

    render(
      <UsersProvider>
        <Consumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  it('sets error when fetching fails', async () => {
    usersApi.getAll.mockRejectedValueOnce(new Error('nope'));

    render(
      <UsersProvider>
        <Consumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('nope');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('allows manual refetch', async () => {
    usersApi.getAll
      .mockResolvedValueOnce({ data: [{ id: 'u1', name: 'Ada' }] })
      .mockResolvedValueOnce({ data: [{ id: 'u2', name: 'Linus' }] });

    const user = userEvent.setup();

    render(
      <UsersProvider>
        <Consumer />
      </UsersProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ada')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /refetch/i }));

    await waitFor(() => {
      expect(usersApi.getAll).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.getByText('Linus')).toBeInTheDocument();
    });
  });
});
