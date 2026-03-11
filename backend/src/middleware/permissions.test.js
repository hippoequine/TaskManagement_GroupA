import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Issue } from '../models/model.js';
import {
  checkIssueView,
  checkIssueModify,
  checkIssueDelete,
} from './permissions';

// MOCK TEST for Issue
vi.mock('../models/model.js', () => ({
  Issue: {
    findByPk: vi.fn(),
  },
}));

describe('Permission Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { dbUser: null, params: {}, body: {} };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  // TEST: CheckIssueView
  describe('checkIssueView', () => {
    it('allows admin to view issues', async () => {
      req.dbUser = { role: 'admin' };
      await checkIssueView(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('allows developer to view issues', async () => {
      req.dbUser = { role: 'developer' };
      await checkIssueView(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('blocks other user like clinician from viewing issues', async () => {
      req.dbUser = { role: 'clinician' };
      await checkIssueView(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Access Denied'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('return 401 if no user in session', async () => {
      await checkIssueView(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  // TEST: CheckIssueModify

  describe('checkIssueModify', () => {
    it('allows admin to create or update issues', async () => {
      req.dbUser = { role: 'admin' };
      await checkIssueModify(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('allows developer to create new issues', async () => {
      req.dbUser = { role: 'developer', id: 'u2' };
      req.params = {};
      await checkIssueModify(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('allows reporter to update issue they created', async () => {
      req.dbUser = { role: 'developer', id: 'u10' };
      req.params.id = 'issue1';

      Issue.findByPk.mockResolvedValue({
        reporterId: 'u10',
        assignees: [],
      });

      await checkIssueModify(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('allows assignee to update issues', async () => {
      req.dbUser = { role: 'developer', id: 'u3' };
      req.params.id = 'issue2';

      Issue.findByPk.mockResolvedValue({
        reporterId: 'testUser',
        assignees: [{ id: 'u3' }],
      });

      await checkIssueModify(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('blocks non-developer from creating issue', async () => {
      req.dbUser = { role: 'clinician', id: 'u4' };
      //creating issue
      req.params = {};
      await checkIssueModify(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('blocks user that is not in the project from updating issue', async () => {
      req.dbUser = { role: 'developer', id: 'u5' };
      req.params.id = 'issue3';

      Issue.findByPk.mockResolvedValue({
        reporterId: 'testUser2',
        assignees: [{ id: 'u6' }],
      });

      await checkIssueModify(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('return 401 if no user in session', async () => {
      await checkIssueModify(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('return 404 if no issue found', async () => {
      req.dbUser = { role: 'developer', id: 'u7' };
      req.params.id = 'missingIssue';
      Issue.findByPk.mockResolvedValue(null);

      await checkIssueModify(req, res, next);
      expect(res.status).toHaveBeenCalled(404);
      expect(next).not.toHaveBeenCalled();
    });
  });

  // TEST: checkIssueDelete
  describe('checkIssueDelete', () => {
    it('allows admin to delete any issue', async () => {
      req.dbUser = { role: 'admin', id: 'admin1' };
      req.params.id = 'issueDelete';
      Issue.findByPk.mockResolvedValue({
        reporterId: 'u8',
      });
      await checkIssueDelete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('allows reporter (user who created issue) to delete issue ', async () => {
      req.dbUser = { role: 'developer', id: 'u9' };
      req.params.id = 'issueDelete2';
      Issue.findByPk.mockResolvedValue({
        reporterId: 'u9',
      });

      await checkIssueDelete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('do not allow other users (not admin or reporter) to delete issue', async () => {
      req.dbUser = { role: 'developer', id: 'u10' };
      req.params.id = 'issueDelete3';
      Issue.findByPk.mockResolvedValue({
        reporterId: 'u11',
      });

      await checkIssueDelete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 if no issue found', async () => {
      req.dbUser = { role: 'developer', id: 'u12' };
      req.params.id = 'issueMissing';
      Issue.findByPk.mockResolvedValue(null);

      await checkIssueDelete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
