import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../models/model.js', () => ({
  Issue: {
    create: vi.fn(),
    findByPk: vi.fn(),
    findAll: vi.fn(),
  },
  Board: {},
  User: {},
}));

import {
  createIssue,
  getIssueByID,
  updateIssue,
  deleteIssue,
  getAllIssues,
} from './issuesController.js';

import { Issue } from '../models/model.js';

describe('issuesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createIssue creates a new issue', async () => {
    const req = {
      body: {
        title: 'Test Issue',
        description: 'Something broke',
        reporterId: 1,
        boardId: 1,
        assigneeIds: [2],
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssue = {
      id: 1,
      setAssignees: vi.fn(),
    };

    Issue.create.mockResolvedValue(fakeIssue);

    await createIssue(req, res);

    expect(Issue.create).toHaveBeenCalled();
    expect(fakeIssue.setAssignees).toHaveBeenCalledWith([2]);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createIssue creates issue when no assignees provided (does not call setAssignees)', async () => {
    const req = {
      body: {
        title: 'Test issue',
        reporterId: 1,
        boardId: 1,
        assigneeIds: [],
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssue = {
      id: 1,
      setAssignees: vi.fn(),
    };

    Issue.create.mockResolvedValue(fakeIssue);

    await createIssue(req, res);

    expect(fakeIssue.setAssignees).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createIssue returns 500 on error', async () => {
    const req = { body: { title: 'Test' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.create.mockRejectedValue(new Error('DB error'));

    await createIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('getIssueByID returns issue when found', async () => {
    const req = {
      params: { id: 1 },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssue = { id: 1, title: 'Bug' };

    Issue.findByPk.mockResolvedValue(fakeIssue);

    await getIssueByID(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      issue: fakeIssue,
    });
  });

  it('getIssueByID returns 404 when issue not found', async () => {
    const req = {
      params: { id: 99 },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    Issue.findByPk.mockResolvedValue(null);

    await getIssueByID(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getIssueByID returns 500 on error', async () => {
    const req = { params: { id: 1 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findByPk.mockRejectedValue(new Error('DB error'));

    await getIssueByID(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('updateIssue updates an existing issue', async () => {
    const req = {
      params: { id: 1 },
      body: { status: 'done' },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssue = {
      update: vi.fn(),
      setAssignees: vi.fn(),
    };

    Issue.findByPk
      .mockResolvedValueOnce(fakeIssue)
      .mockResolvedValueOnce(fakeIssue); // second lookup

    await updateIssue(req, res);

    expect(fakeIssue.update).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('updateIssue returns 404 when updating missing issue', async () => {
    const req = {
      params: { id: 99 },
      body: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    Issue.findByPk.mockResolvedValue(null);

    await updateIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updateIssue returns 500 on error', async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findByPk.mockRejectedValue(new Error('DB error'));

    await updateIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('deleteIssue deletes an issue', async () => {
    const req = {
      params: { id: 1 },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssue = {
      destroy: vi.fn(),
    };

    Issue.findByPk.mockResolvedValue(fakeIssue);

    await deleteIssue(req, res);

    expect(fakeIssue.destroy).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteIssue returns 404 when issue not found', async () => {
    const req = { params: { id: 99 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findByPk.mockResolvedValue(null);

    await deleteIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('deleteIssue returns 500 on error', async () => {
    const req = { params: { id: 1 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findByPk.mockRejectedValue(new Error('DB error'));

    await deleteIssue(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getAllIssues returns list of issues', async () => {
    const req = {
      query: {},
      params: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const fakeIssues = [{ id: 1 }, { id: 2 }];

    Issue.findAll.mockResolvedValue(fakeIssues);

    await getAllIssues(req, res);

    expect(Issue.findAll).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAllIssues filters by type, priority, status, reporterId, and search', async () => {
    const req = {
      query: {
        type: 'bug',
        priority: 'high',
        status: 'open',
        reporterId: 1,
        search: 'crash',
      },
      params: {},
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findAll.mockResolvedValue([{ id: 1 }]);

    await getAllIssues(req, res);

    expect(Issue.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: 'bug',
          priority: 'high',
          status: 'open',
          reporterId: 1,
        }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAllIssues filters by boardId when provided', async () => {
    const req = {
      query: {},
      params: { boardId: 5 },
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findAll.mockResolvedValue([]);

    await getAllIssues(req, res);

    expect(Issue.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ boardId: 5 }),
        include: expect.arrayContaining([
          expect.objectContaining({ as: 'assignees' }),
        ]),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getAllIssues returns 500 on error', async () => {
    const req = { query: {}, params: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Issue.findAll.mockRejectedValue(new Error('DB error'));

    await getAllIssues(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });
});
