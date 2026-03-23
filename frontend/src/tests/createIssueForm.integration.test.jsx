// integration of UI -> api layer
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import CreateIssueForm from '../components/IssueForm/CreateIssueForm';
import api from '../api/axios';

// Mocks - api, contexts
vi.mock('../api/axios');

vi.mock('../context/ProjectContext', () => ({
  useProject: () => ({
    currentProject: { id: 'proj-1' },
  }),
}));

vi.mock('../context/BoardContext', () => ({
  useBoard: () => ({
    currentBoard: { id: 'board-1' },
  }),
}));

vi.mock('../auth/useAuth', () => ({
  default: () => ({
    user: { sub: 'user-1' },
  }),
}));

describe('Integration: Create Issue Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('user creates an issue successfully', async () => {
    api.post.mockResolvedValue({
      data: { success: true },
    });

    const mockOnIssueCreation = vi.fn();

    render(<CreateIssueForm onIssueCreation={mockOnIssueCreation} />);

    // Fill in form
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, {
      target: { value: 'Test Issue Title' },
    });

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Issue description' },
    });

    const user = userEvent.setup();

    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.click(prioritySelect);
    const mediumOption = screen.getByText('medium');
    await user.click(mediumOption);

    const storyptSelect = screen.getByRole('button', { name: '5' });
    await user.click(storyptSelect);

    const typeSelect = screen.getByRole('button', { name: 'bug' });
    await user.click(typeSelect);

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /create issue/i,
    });
    fireEvent.click(submitButton);

    // expect statements
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/issues',
        expect.objectContaining({
          title: 'Test Issue Title',
          description: 'Test Issue description',
          priority: 'medium',
          storyPoints: 5,
          type: 'bug',
          projectId: 'proj-1',
          boardId: 'board-1',
          reporterId: 'user-1',
        })
      );
    });

    expect(
      await screen.findByText(/issue created successfully/i)
    ).toBeInTheDocument();

    expect(mockOnIssueCreation).toHaveBeenCalled();
  });
});
