// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StoryPointButtonGroup from '../components/IssueForm/StoryPointButtonGroup';

describe('StoryPointButtonGroup', () => {
  const mockOnUpdatePoints = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all story point options', () => {
    render(
      <StoryPointButtonGroup points={1} onUpdatePoints={mockOnUpdatePoints} />
    );

    const points = [1, 2, 3, 5, 8, 13, 21, 34];
    points.forEach((point) => {
      expect(screen.getAllByText(point.toString())[0]).toBeDefined();
    });
  });

  it('highlights the selected story point', () => {
    render(
      <StoryPointButtonGroup points={5} onUpdatePoints={mockOnUpdatePoints} />
    );

    const selectedButton = screen.getAllByRole('button', { name: '5' })[0];
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onUpdatePoints when a different point is selected', async () => {
    const user = userEvent.setup();
    render(
      <StoryPointButtonGroup points={1} onUpdatePoints={mockOnUpdatePoints} />
    );

    const pointButton = screen.getAllByRole('button', { name: '3' })[0];
    await user.click(pointButton);

    expect(mockOnUpdatePoints).toHaveBeenCalledWith(3);
  });

  it('does not call onUpdatePoints when the same point is clicked (unselects instead)', async () => {
    const user = userEvent.setup();
    render(
      <StoryPointButtonGroup points={1} onUpdatePoints={mockOnUpdatePoints} />
    );

    const pointButton = screen.getAllByRole('button', { name: '1' })[0];
    await user.click(pointButton);

    // When clicking the same point, the ToggleButtonGroup sends null (unselect)
    expect(mockOnUpdatePoints).toHaveBeenCalledWith(null);
  });

  it('handles selection of each story point value', async () => {
    const user = userEvent.setup();
    const points = [1, 2, 3, 5, 8, 13, 21, 34];

    for (const point of points) {
      // Reset mock before each new render
      mockOnUpdatePoints.mockClear();
      const { unmount } = render(
        <StoryPointButtonGroup points={1} onUpdatePoints={mockOnUpdatePoints} />
      );

      const pointButton = screen.getAllByRole('button', {
        name: point.toString(),
      })[0];
      await user.click(pointButton);

      // If clicking the same point (1), expect null, otherwise expect the point value
      if (point === 1) {
        expect(mockOnUpdatePoints).toHaveBeenCalledWith(null);
      } else {
        expect(mockOnUpdatePoints).toHaveBeenCalledWith(point);
      }
      unmount();
    }
  });
});
