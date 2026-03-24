import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersStatCard from '../components/UsersStatCard';
import { useUsers } from '../context/UsersContext';

vi.mock('../context/UsersContext', () => ({
  useUsers: vi.fn(),
}));

describe('UsersStatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Displays "Loading..." when the data is fetching', () => {
    useUsers.mockReturnValue({ users: [], loading: true });

    render(<UsersStatCard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('correctly calculates and displays user metrics by role', () => {
    const mockUsers = [
      { id: 1, role: 'developer' },
      { id: 2, role: 'developer' },
      { id: 3, role: 'clinician' },
      { id: 4, role: 'admin' },
      { id: 5, role: 'guest' },
    ];

    useUsers.mockReturnValue({ users: mockUsers, loading: false });

    render(<UsersStatCard />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText(/1 Clinician\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Developer\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1 Admin\(s\)/i)).toBeInTheDocument();
  });

  it('handles an empty user list gracefully', () => {
    useUsers.mockReturnValue({ users: [], loading: false });

    render(<UsersStatCard />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(
      screen.getByText(/0 Clinician\(s\), 0 Developer\(s\), 0 Admin\(s\)/i)
    ).toBeInTheDocument();
  });
});
