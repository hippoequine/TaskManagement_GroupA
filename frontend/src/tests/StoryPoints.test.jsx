// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StoryPoints from '../components/issue-card/StoryPoints';

describe('StoryPoints', () => {
  describe('rendering', () => {
    it('renders with points value', () => {
      render(<StoryPoints points={5} onChange={vi.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('5');
    });

    it('renders with zero points', () => {
      render(<StoryPoints points={0} onChange={vi.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('0');
    });

    it('renders with large points value', () => {
      render(<StoryPoints points={100} onChange={vi.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('100');
    });

    it('renders "-" when points is null', () => {
      render(<StoryPoints points={null} onChange={vi.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('-');
    });

    it('renders "-" when points is undefined', () => {
      render(<StoryPoints points={undefined} onChange={vi.fn()} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('-');
    });
  });

  describe('onChange', () => {
    it('calls onChange when input value changes', () => {
      const mockOnChange = vi.fn();
      render(<StoryPoints points={5} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '8' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('passes event to onChange handler', () => {
      const mockOnChange = vi.fn();
      render(<StoryPoints points={5} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '13' } });

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls onChange for each input change', () => {
      const mockOnChange = vi.fn();
      render(<StoryPoints points={5} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.change(input, { target: { value: '2' } });
      fireEvent.change(input, { target: { value: '3' } });

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('controlled input behavior', () => {
    it('displays updated points when prop changes', () => {
      const { rerender } = render(
        <StoryPoints points={5} onChange={vi.fn()} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('5');

      rerender(<StoryPoints points={8} onChange={vi.fn()} />);

      expect(screen.getByRole('textbox')).toHaveValue('8');
    });

    it('switches from number to "-" when points becomes null', () => {
      const { rerender } = render(
        <StoryPoints points={5} onChange={vi.fn()} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('5');

      rerender(<StoryPoints points={null} onChange={vi.fn()} />);

      expect(screen.getByRole('textbox')).toHaveValue('-');
    });
  });
});
