import { describe, it, expect } from 'vitest';

import WorkflowService from './WorkflowService.js';

describe('WorkflowService', async () => {
  it('gets a list of allowed statuses', () => {
    const result = WorkflowService.getAllowedStatuses();
    expect(result).toEqual([
      'backlog',
      'in_progress',
      'reviewed',
      'done',
      'archived',
    ]);
  });

  it('returns a list of allowed transitions', () => {
    const result = WorkflowService.getAllowedTransitions('in_progress');
    expect(result).toEqual(['reviewed', 'backlog']);
  });

  it('returns an empty array when no transitions are allowed', () => {
    const result = WorkflowService.getAllowedTransitions('');
    expect(result).toEqual([]);
  });

  it('allows a valid transition', () => {
    const result = WorkflowService.validateTransition(
      'in_progress',
      'reviewed'
    );
    expect(result).toBe(true);
  });

  it('forbids an invalid transition', () => {
    const result = WorkflowService.validateTransition('in_progress', 'done');
    expect(result).toBe(false);
  });
});
