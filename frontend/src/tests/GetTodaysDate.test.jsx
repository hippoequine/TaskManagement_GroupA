import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GetTodaysDate from '../components/GetTodaysDate';

describe('GetTodaysDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders today's date in the correct long format", () => {
    const mockDate = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(mockDate);

    render(<GetTodaysDate />);

    expect(screen.getByText(/Monday, January 01, 2024/i)).toBeInTheDocument();
  });

  it('updates the display if the system time changes', () => {
    const mockDate = new Date('2026-03-23T12:00:00');
    vi.setSystemTime(mockDate);

    render(<GetTodaysDate />);

    expect(screen.getByText(/Monday, March 23, 2026/i)).toBeInTheDocument();
  });
});
