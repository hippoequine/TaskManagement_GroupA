import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserTable from '../components/UserTable';
import { useUsers } from '../context/UsersContext';

vi.mock('../context/UsersContext', () => ({
  useUsers: vi.fn(),
}));

describe('UserTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    useUsers.mockReturnValue({ users: [], loading: true, error: null });

    render(<UserTable />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    useUsers.mockReturnValue({
      users: [],
      loading: false,
      error: 'Unauthorized Access',
    });

    render(<UserTable />);

    expect(screen.getByText(/Error: Unauthorized Access/i)).toBeInTheDocument();
  });

  it('renders empty state message when no users exist', () => {
    useUsers.mockReturnValue({ users: [], loading: false, error: null });

    render(<UserTable />);

    expect(screen.getByText(/No users found!/i)).toBeInTheDocument();
  });

  it('renders a list of users with correct data and formatting', () => {
    const mockUsers = [
      {
        id: 'u1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Admin',
        createdAt: '2023-05-20T10:00:00Z',
      },
      {
        id: 'u2',
        fullName: 'John Doe',
        email: null,
        role: 'Developer',
        createdAt: '2023-06-15T10:00:00Z',
      },
    ];

    useUsers.mockReturnValue({ users: mockUsers, loading: false, error: null });

    render(<UserTable />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('No email')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // The header + 2 rows of data
  });
});
