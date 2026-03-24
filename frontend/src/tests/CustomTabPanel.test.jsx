import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CustomTabPanel from '../components/CustomTabPanel';

describe('CustomTabPanel', () => {
  it('renders children and is visible when value matches index', () => {
    render(
      <CustomTabPanel value={0} index={0}>
        <div data-testid="test-content">Tab Content</div>
      </CustomTabPanel>
    );

    const panel = screen.getByRole('tabpanel');

    expect(panel.hasAttribute('hidden')).toBe(false);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('is hidden and does not render children when value does not match index', () => {
    render(
      <CustomTabPanel value={1} index={0}>
        <div data-testid="test-content">Tab Content</div>
      </CustomTabPanel>
    );

    const panel = screen.getByRole('tabpanel', { hidden: true });
    expect(panel.hasAttribute('hidden')).toBe(true);
  });

  it('applies correct accessibility attributes based on index', () => {
    render(
      <CustomTabPanel value={0} index={5}>
        Content
      </CustomTabPanel>
    );

    const panel = screen.getByRole('tabpanel', { hidden: true });

    expect(panel).toHaveAttribute('id', 'simple-tabpanel-5');
    expect(panel).toHaveAttribute('aria-labelledby', 'simple-tab-5');
  });
});
