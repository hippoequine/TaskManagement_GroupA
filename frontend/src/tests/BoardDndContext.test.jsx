// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  isValidTransition,
  BoardDndProvider,
  useBoardDnd,
} from '../context/BoardDndContext';

// Mock IssuesContext
vi.mock('../context/IssuesContext.jsx', () => ({
  useIssues: () => ({
    issues: [],
    moveIssue: vi.fn(),
    reorderIssues: vi.fn(),
  }),
}));

describe('isValidTransition', () => {
  describe('same column transitions (always valid)', () => {
    it('returns true when fromStatus equals toStatus', () => {
      expect(isValidTransition('backlog', 'backlog')).toBe(true);
      expect(isValidTransition('in_progress', 'in_progress')).toBe(true);
      expect(isValidTransition('reviewed', 'reviewed')).toBe(true);
      expect(isValidTransition('done', 'done')).toBe(true);
      expect(isValidTransition('archived', 'archived')).toBe(true);
    });
  });

  describe('backlog transitions', () => {
    it('allows backlog -> in_progress', () => {
      expect(isValidTransition('backlog', 'in_progress')).toBe(true);
    });

    it('disallows backlog -> reviewed', () => {
      expect(isValidTransition('backlog', 'reviewed')).toBe(false);
    });

    it('disallows backlog -> done', () => {
      expect(isValidTransition('backlog', 'done')).toBe(false);
    });

    it('disallows backlog -> archived', () => {
      expect(isValidTransition('backlog', 'archived')).toBe(false);
    });
  });

  describe('in_progress transitions', () => {
    it('allows in_progress -> reviewed', () => {
      expect(isValidTransition('in_progress', 'reviewed')).toBe(true);
    });

    it('allows in_progress -> backlog', () => {
      expect(isValidTransition('in_progress', 'backlog')).toBe(true);
    });

    it('disallows in_progress -> done', () => {
      expect(isValidTransition('in_progress', 'done')).toBe(false);
    });

    it('disallows in_progress -> archived', () => {
      expect(isValidTransition('in_progress', 'archived')).toBe(false);
    });
  });

  describe('reviewed transitions', () => {
    it('allows reviewed -> done', () => {
      expect(isValidTransition('reviewed', 'done')).toBe(true);
    });

    it('allows reviewed -> in_progress', () => {
      expect(isValidTransition('reviewed', 'in_progress')).toBe(true);
    });

    it('disallows reviewed -> backlog', () => {
      expect(isValidTransition('reviewed', 'backlog')).toBe(false);
    });

    it('disallows reviewed -> archived', () => {
      expect(isValidTransition('reviewed', 'archived')).toBe(false);
    });
  });

  describe('done transitions', () => {
    it('allows done -> reviewed', () => {
      expect(isValidTransition('done', 'reviewed')).toBe(true);
    });

    it('allows done -> archived', () => {
      expect(isValidTransition('done', 'archived')).toBe(true);
    });

    it('disallows done -> backlog', () => {
      expect(isValidTransition('done', 'backlog')).toBe(false);
    });

    it('disallows done -> in_progress', () => {
      expect(isValidTransition('done', 'in_progress')).toBe(false);
    });
  });

  describe('archived transitions', () => {
    it('disallows archived -> any other status', () => {
      expect(isValidTransition('archived', 'backlog')).toBe(false);
      expect(isValidTransition('archived', 'in_progress')).toBe(false);
      expect(isValidTransition('archived', 'reviewed')).toBe(false);
      expect(isValidTransition('archived', 'done')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false for unknown fromStatus', () => {
      expect(isValidTransition('unknown', 'backlog')).toBe(false);
    });

    it('returns false for unknown toStatus', () => {
      expect(isValidTransition('backlog', 'unknown')).toBe(false);
    });
  });
});

describe('BoardDndProvider', () => {
  // Test component to access context
  function TestConsumer() {
    const context = useBoardDnd();
    return (
      <div>
        <span data-testid="has-context">{context ? 'yes' : 'no'}</span>
        <span data-testid="active-issue">
          {context?.activeIssue ? context.activeIssue.id : 'none'}
        </span>
      </div>
    );
  }

  it('renders children', () => {
    render(
      <BoardDndProvider>
        <div data-testid="child">Child Content</div>
      </BoardDndProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('provides context to children', () => {
    render(
      <BoardDndProvider>
        <TestConsumer />
      </BoardDndProvider>
    );

    expect(screen.getByTestId('has-context')).toHaveTextContent('yes');
  });

  it('initializes activeIssue as null', () => {
    render(
      <BoardDndProvider>
        <TestConsumer />
      </BoardDndProvider>
    );

    expect(screen.getByTestId('active-issue')).toHaveTextContent('none');
  });
});
