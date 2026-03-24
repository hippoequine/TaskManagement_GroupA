import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import TitleField from '../components/IssueForm/TitleField';

describe('TitleField', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the title label', () => {
    render(<TitleField title="" onUpdateTitle={vi.fn()} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });

  it('displays the provided title value', () => {
    const mockUpdate = vi.fn();
    render(<TitleField title="task" onUpdateTitle={mockUpdate} />);

    expect(screen.getByDisplayValue('task')).toBeInTheDocument();
  });

  it('calls onUpdateTitle when typed into', () => {
    const mockUpdate = vi.fn();
    render(<TitleField title="" onUpdateTitle={mockUpdate} />);
    const textarea = screen.getByLabelText(/title/i);
    fireEvent.change(textarea, { target: { value: 'task' } });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith('task');
  });
});
