import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Issue } from '../models/model.js';

vi.mock('../models/model.js', () => ({
  Issue: {
    findByPk: vi.fn(),
  },
}));

vi.mock('../services/WorkflowService.js', () => ({
  default: {
    validateTransition: vi.fn(),
  },
}));

import { requireWorkflowCompliance } from './workflow.js';
import WorkflowService from '../services/WorkflowService.js';

describe('requireWorkflowCompliance middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next() when transition is valid', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'in_progress' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    Issue.findByPk.mockResolvedValue({
      status: 'backlog',
      assignees: [{ id: 1 }],
    });

    WorkflowService.validateTransition.mockReturnValue(true);

    await requireWorkflowCompliance(req, res, next);

    expect(Issue.findByPk).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 when transition is invalid', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'done' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    Issue.findByPk.mockResolvedValue({
      status: 'backlog',
      assignees: [{ id: 1 }],
    });

    WorkflowService.validateTransition.mockReturnValue(false);

    await requireWorkflowCompliance(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid status transition from backlog to done',
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('returns 404 when the issue is not found', async () => {
    const req = {
      params: { id: 999 },
      body: { status: 'in_progress' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    Issue.findByPk.mockResolvedValue(null);

    await requireWorkflowCompliance(req, res, next);
    expect(Issue.findByPk).toHaveBeenCalledWith(999, {
      include: ['assignees'],
    });

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Issue not found',
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when there is no new status', async () => {
    const req = {
      params: { id: 999 },
      body: { status: '' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    await requireWorkflowCompliance(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(Issue.findByPk).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns 400 when the issue has no assignee', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'done' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const next = vi.fn();

    Issue.findByPk.mockResolvedValue({
      status: 'reviewed',
      assignees: [],
    });

    WorkflowService.validateTransition.mockReturnValue(true);

    await requireWorkflowCompliance(req, res, next);

    expect(Issue.findByPk).toHaveBeenCalledWith(1, {
      include: ['assignees'],
    });

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Cannot move ticket to DONE without an assignee',
    });

    expect(next).not.toHaveBeenCalled();
  });
});
