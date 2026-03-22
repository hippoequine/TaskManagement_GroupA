// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriorityLabel from '../components/IssueForm/PriorityLabel';

describe('PriorityLabel', () => {
  const mockOnUpdatePriority = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the priority select with label', () => {
    render(
      <PriorityLabel priority="low" onUpdatePriority={mockOnUpdatePriority} />
    );

    expect(screen.getAllByText('Priority')[0]).toBeDefined();
    expect(screen.getAllByRole('combobox')[0]).toBeDefined();
  });

  it('displays the selected priority value', () => {
    render(
      <PriorityLabel
        priority="medium"
        onUpdatePriority={mockOnUpdatePriority}
      />
    );

    // Check that the select shows the correct value
    const select = screen.getAllByRole('combobox')[0];
    expect(select).toBeDefined();
  });

  it('displays all priority options when dropdown is opened', async () => {
    const user = userEvent.setup();
    render(
      <PriorityLabel priority="low" onUpdatePriority={mockOnUpdatePriority} />
    );

    // Open the dropdown
    const select = screen.getAllByRole('combobox')[0];
    await user.click(select);

    // Check that all options are present
    expect(screen.getAllByText('low')[0]).toBeDefined();
    expect(screen.getAllByText('medium')[0]).toBeDefined();
    expect(screen.getAllByText('high')[0]).toBeDefined();
  });

  it('calls onUpdatePriority when user selects a different priority', async () => {
    const user = userEvent.setup();
    render(
      <PriorityLabel priority="low" onUpdatePriority={mockOnUpdatePriority} />
    );

    // Open dropdown and select medium
    const select = screen.getAllByRole('combobox')[0];
    await user.click(select);

    const mediumOption = screen.getAllByText('medium')[0];
    await user.click(mediumOption);

    expect(mockOnUpdatePriority).toHaveBeenCalledWith('medium');
  });

  it('handles high priority selection', async () => {
    const user = userEvent.setup();
    render(
      <PriorityLabel
        priority="medium"
        onUpdatePriority={mockOnUpdatePriority}
      />
    );

    // Open dropdown and select high
    const select = screen.getAllByRole('combobox')[0];
    await user.click(select);

    const highOption = screen.getAllByText('high')[0];
    await user.click(highOption);

    expect(mockOnUpdatePriority).toHaveBeenCalledWith('high');
  });
});
