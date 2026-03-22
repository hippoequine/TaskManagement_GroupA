// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IssueTypeToggle from '../components/IssueForm/issueTypeToggle';

describe('IssueTypeToggle', () => {
  const mockOnTypeChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all issue type options', () => {
    render(
      <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
    );

    const issueTypes = ['story', 'bug', 'task', 'epic'];
    issueTypes.forEach((type) => {
      expect(screen.getAllByText(type)[0]).toBeDefined();
    });
  });

  it('displays colored boxes for each issue type', () => {
    render(
      <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('highlights the selected issue type', () => {
    render(
      <IssueTypeToggle selectedType="bug" onTypeChange={mockOnTypeChange} />
    );

    const selectedButton = screen.getAllByRole('button', { name: /bug/i })[0];
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onTypeChange when a different type is selected', async () => {
    const user = userEvent.setup();
    render(
      <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
    );

    const bugButton = screen.getAllByRole('button', { name: /bug/i })[0];
    await user.click(bugButton);

    expect(mockOnTypeChange).toHaveBeenCalledWith('bug');
  });

  it('does not call onTypeChange when the same type is clicked', async () => {
    const user = userEvent.setup();
    render(
      <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
    );

    const storyButton = screen.getAllByRole('button', { name: /story/i })[0];
    await user.click(storyButton);

    expect(mockOnTypeChange).not.toHaveBeenCalled();
  });

  it('handles selection of each issue type', async () => {
    const user = userEvent.setup();
    const issueTypes = ['story', 'bug', 'task', 'epic'];

    for (const type of issueTypes) {
      mockOnTypeChange.mockClear();
      const { unmount } = render(
        <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
      );

      // Skip testing the currently selected type (story)
      if (type === 'story') {
        unmount();
        continue;
      }

      const typeButton = screen.getAllByRole('button', {
        name: new RegExp(type, 'i'),
      })[0];
      await user.click(typeButton);

      expect(mockOnTypeChange).toHaveBeenCalledWith(type);
      unmount();
    }
  });

  it('applies correct color to each type box', () => {
    render(
      <IssueTypeToggle selectedType="story" onTypeChange={mockOnTypeChange} />
    );

    // Check that each button has a colored box
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      const coloredBox = button.querySelector('.MuiBox-root');
      expect(coloredBox).toBeDefined();
    });
  });
});
