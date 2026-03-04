// @vitest-environment jsdom
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from '../App';
import useAuth from '../auth/useAuth';

//Mock the admin dashboards
vi.mock('../dashboard/AdminDashboard.jsx', () => ({
  default: () => <div>Admin Dashboard</div>,
}));

//Mock the clinician dashboard
vi.mock('../dashboard/ClinicianDashboard.jsx', () => ({
  default: () => <div>Clinician Dashboard</div>,
}));

//Mock the developer dashboard
vi.mock('../dashboard/DeveloperDashboard.jsx', () => ({
  default: () => <div>Developer Dashboard</div>,
}));

// Mock useAuth (custom hook)
vi.mock('../auth/useAuth.js');

describe('App: role-based rendering for dashboards', () => {
  const loginMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  //TEST: Loading State
  it('renders a global loading spinner when isLoading is true', () => {
    useAuth.mockReturnValue({
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByRole('progressbar')).toBeDefined();
  });

  //TEST: Not authenticated
  it('renders login prompt when user not authenticated and asked to login again', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: loginMock,
    });

    render(<App />);
    expect(screen.getByText(/Please log in to continue/i)).toBeDefined();
  });

  //TEST: Aunthenticated but roles are empty
  it('renders "loading roles..." when user is authenticated but roles are empty', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      roles: [],
      user: { name: 'John' },
    });

    render(<App />);
    expect(screen.getByText(/Loading roles.../i)).toBeDefined();
  });

  //TEST: Admin Role
  it('renders AdminDashboard for user with admin role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      roles: ['admin'],
      user: { name: 'Bob' },
      login: loginMock,
      logout: logoutMock,
    });

    render(<App />);

    expect(screen.getByText(/Bob/i)).toBeDefined();
    //admin dashboard will show
    expect(screen.getByText('Admin Dashboard')).toBeDefined();
    //clinician dashboard should not show
    expect(screen.queryByText('Clinician Dashboard')).toBeNull();
    //developer dashboard should not show
    expect(screen.queryByText('Developer Dashboard')).toBeNull();
  });

  //TEST: Clinician Role
  it('renders ClinicianDashboard for user with clinician role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      roles: ['clinician'],
      user: { name: 'Jane' },
      login: loginMock,
      logout: logoutMock,
    });

    render(<App />);
    expect(screen.getByText(/Jane/i)).toBeDefined();
    expect(screen.getByText('Clinician Dashboard')).toBeDefined();
    expect(screen.queryByText('Admin Dashboard')).toBeNull();
    expect(screen.queryByText('Developer Dashboard')).toBeNull();
  });

  //TEST: Developer Role
  it('renders DeveloperDashboard for user with developer role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      roles: ['developer'],
      user: { name: 'John' },
      login: loginMock,
      logout: logoutMock,
    });

    render(<App />);
    expect(screen.getByText(/John/i)).toBeDefined();
    expect(screen.getByText('Developer Dashboard')).toBeDefined();
    expect(screen.queryByText('Admin Dashboard')).toBeNull();
    expect(screen.queryByText('Clinician Dashboard')).toBeNull();
  });
});
