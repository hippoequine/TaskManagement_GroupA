import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../models/Project.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findAndCountAll: vi.fn(),
  },
}));

vi.mock('../models/Board.js', () => ({
  default: {
    findAll: vi.fn(),
  },
}));

vi.mock('../models/User.js', () => ({
  default: {},
}));

import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBoards,
  updateProject,
} from './projectController.js';

import Project from '../models/Project.js';
import Board from '../models/Board.js';

describe('projectController', () => {
  let res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  // ─── createProject ─────────────────────────────────────────────────────────

  describe('createProject', () => {
    it('returns 401 if req.user is missing', async () => {
      const req = { body: {}, user: null };
      await createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 400 if name is missing', async () => {
      const req = { body: { key: 'PROJ' }, user: { sub: 'user-1' } };
      await createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('name') })
      );
    });

    it('returns 400 if key is missing', async () => {
      const req = { body: { name: 'Test' }, user: { sub: 'user-1' } };
      await createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('key') })
      );
    });

    it('returns 400 if key format is invalid', async () => {
      const req = {
        body: { name: 'Test', key: 'invalid key!' },
        user: { sub: 'user-1' },
      };
      await createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 409 if key is already in use', async () => {
      const req = {
        body: { name: 'Test', key: 'PROJ' },
        user: { sub: 'user-1' },
      };
      Project.findOne.mockResolvedValueOnce({ id: 'existing-id' });
      await createProject(req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('creates project and returns 201 with owner data', async () => {
      const req = {
        body: {
          name: 'Test',
          key: 'PROJ',
          description: 'desc',
          category: 'New Development',
          status: 'active',
        },
        user: { sub: 'user-1' },
      };
      const fakeCreated = {
        id: 'new-id',
        name: 'Test',
        owner: { firstName: 'John' },
      };
      Project.findOne
        .mockResolvedValueOnce(null) // key not taken
        .mockResolvedValueOnce(fakeCreated); // re-fetch with owner
      Project.create.mockResolvedValueOnce({ id: 'new-id' });

      await createProject(req, res, next);

      expect(Project.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeCreated);
    });

    it('defaults status to active when not provided', async () => {
      const req = {
        body: { name: 'Test', key: 'PROJ' },
        user: { sub: 'user-1' },
      };
      Project.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'new-id' });
      Project.create.mockResolvedValueOnce({ id: 'new-id' });

      await createProject(req, res, next);

      expect(Project.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' })
      );
    });

    it('normalizes key to uppercase before saving', async () => {
      const req = {
        body: { name: 'Test', key: 'proj' },
        user: { sub: 'user-1' },
      };
      Project.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'new-id' });
      Project.create.mockResolvedValueOnce({ id: 'new-id' });

      await createProject(req, res, next);

      expect(Project.create).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'PROJ' })
      );
    });

    it('calls next on error', async () => {
      const req = {
        body: { name: 'Test', key: 'PROJ' },
        user: { sub: 'user-1' },
      };
      Project.findOne.mockRejectedValue(new Error('DB error'));

      await createProject(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ─── getProjects ───────────────────────────────────────────────────────────

  describe('getProjects', () => {
    it('returns paginated projects', async () => {
      const req = { query: {} };
      Project.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: [{ id: '1' }, { id: '2' }],
      });

      await getProjects(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 2,
          page: 1,
          projects: expect.any(Array),
        })
      );
    });

    it('uses page and limit from query params', async () => {
      const req = { query: { page: '2', limit: '5' } };
      Project.findAndCountAll.mockResolvedValue({ count: 10, rows: [] });

      await getProjects(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, totalPages: 2 })
      );
    });

    it('filters by category when provided', async () => {
      const req = { query: { category: 'Maintenance' } };
      Project.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getProjects(req, res, next);

      expect(Project.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'Maintenance' }),
        })
      );
    });

    it('filters by status when provided', async () => {
      const req = { query: { status: 'completed' } };
      Project.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getProjects(req, res, next);

      expect(Project.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'completed' }),
        })
      );
    });

    it('includes owner in the query', async () => {
      const req = { query: {} };
      Project.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getProjects(req, res, next);

      expect(Project.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'owner' }),
          ]),
        })
      );
    });

    it('calls next on error', async () => {
      const req = { query: {} };
      Project.findAndCountAll.mockRejectedValue(new Error('DB error'));

      await getProjects(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ─── getProjectById ────────────────────────────────────────────────────────

  describe('getProjectById', () => {
    it('returns 400 if id param is missing', async () => {
      const req = { params: {}, query: {} };
      await getProjectById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 404 if project is not found', async () => {
      const req = { params: { id: 'non-existent' }, query: {} };
      Project.findOne.mockResolvedValue(null);

      await getProjectById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns project when found', async () => {
      const fakeProject = { id: 'abc', name: 'My Project' };
      const req = { params: { id: 'abc' }, query: {} };
      Project.findOne.mockResolvedValue(fakeProject);

      await getProjectById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(fakeProject);
    });

    it('filters by owner_id when query param is provided', async () => {
      const req = { params: { id: 'abc' }, query: { owner_id: 'user-1' } };
      Project.findOne.mockResolvedValue({ id: 'abc' });

      await getProjectById(req, res, next);

      expect(Project.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ owner_id: 'user-1' }),
        })
      );
    });

    it('calls next on error', async () => {
      const req = { params: { id: 'abc' }, query: {} };
      Project.findOne.mockRejectedValue(new Error('DB error'));

      await getProjectById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ─── getProjectBoards ──────────────────────────────────────────────────────

  describe('getProjectBoards', () => {
    it('returns 404 if project is not found', async () => {
      const req = { params: { id: 'abc' }, query: {} };
      Project.findOne.mockResolvedValue(null);

      await getProjectBoards(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns boards for a found project', async () => {
      const fakeBoards = [{ id: 1 }, { id: 2 }];
      const req = { params: { id: 'abc' }, query: {} };
      Project.findOne.mockResolvedValue({ id: 'abc' });
      Board.findAll.mockResolvedValue(fakeBoards);

      await getProjectBoards(req, res, next);

      expect(Board.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { projectId: 'abc' } })
      );
      expect(res.json).toHaveBeenCalledWith(fakeBoards);
    });

    it('calls next on error', async () => {
      const req = { params: { id: 'abc' }, query: {} };
      Project.findOne.mockRejectedValue(new Error('DB error'));

      await getProjectBoards(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ─── updateProject ─────────────────────────────────────────────────────────

  describe('updateProject', () => {
    it('returns 404 if project is not found', async () => {
      const req = { params: { id: 'abc' }, query: {}, body: {} };
      Project.findOne.mockResolvedValueOnce(null);

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 400 if new key format is invalid', async () => {
      const fakeProject = { id: 'abc', update: vi.fn(), reload: vi.fn() };
      const req = {
        params: { id: 'abc' },
        query: {},
        body: { key: 'invalid key!' },
      };
      Project.findOne.mockResolvedValueOnce(fakeProject);

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 409 if new key is already used by another project', async () => {
      const fakeProject = { id: 'abc', update: vi.fn(), reload: vi.fn() };
      const req = {
        params: { id: 'abc' },
        query: {},
        body: { key: 'TAKEN' },
      };
      Project.findOne
        .mockResolvedValueOnce(fakeProject) // find project to update
        .mockResolvedValueOnce({ id: 'other-id' }); // key already taken

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it('allows updating with the same key (own project key)', async () => {
      const fakeProject = { id: 'abc', update: vi.fn(), reload: vi.fn() };
      const req = {
        params: { id: 'abc' },
        query: {},
        body: { name: 'Updated', key: 'SAME' },
      };
      Project.findOne
        .mockResolvedValueOnce(fakeProject)
        .mockResolvedValueOnce({ id: 'abc' }); // same project owns the key

      await updateProject(req, res, next);

      expect(fakeProject.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeProject);
    });

    it('updates project without key change when key not in body', async () => {
      const fakeProject = { id: 'abc', update: vi.fn(), reload: vi.fn() };
      const req = {
        params: { id: 'abc' },
        query: {},
        body: { name: 'New Name', status: 'completed' },
      };
      Project.findOne.mockResolvedValueOnce(fakeProject);

      await updateProject(req, res, next);

      expect(fakeProject.update).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name', status: 'completed' })
      );
      expect(fakeProject.reload).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeProject);
    });

    it('reloads project with owner include after update', async () => {
      const fakeProject = { id: 'abc', update: vi.fn(), reload: vi.fn() };
      const req = {
        params: { id: 'abc' },
        query: {},
        body: { name: 'New Name' },
      };
      Project.findOne.mockResolvedValueOnce(fakeProject);

      await updateProject(req, res, next);

      expect(fakeProject.reload).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'owner' }),
          ]),
        })
      );
    });

    it('calls next on error', async () => {
      const req = { params: { id: 'abc' }, query: {}, body: {} };
      Project.findOne.mockRejectedValue(new Error('DB error'));

      await updateProject(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
