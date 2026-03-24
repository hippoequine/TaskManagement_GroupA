import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import DescriptionField from '../components/IssueForm/DescriptionField';

describe('DescriptionField', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the description lable', () => {
    render(<DescriptionField description="" onUpdateDescription={vi.fn()} />);

    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('displays the provided description value', () => {
    render(
      <DescriptionField description="fix a bug" onUpdateDescription={vi.fn()} />
    );

    expect(screen.getByDisplayValue('fix a bug')).toBeInTheDocument();
  });

  it('calls onUpdateDescription with input when typed into', () => {
    const mockUpdate = vi.fn();
    render(
      <DescriptionField description="" onUpdateDescription={mockUpdate} />
    );
    const textarea = screen.getByLabelText(/description/i);
    fireEvent.change(textarea, { target: { value: 'fix a bug' } });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith('fix a bug');
  });
});
