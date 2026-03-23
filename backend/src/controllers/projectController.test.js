import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBoards,
  updateProject,
} from './projectController.js';
import Project from '../models/Project.js';
import Board from '../models/Board.js';

// Mock models
vi.mock('../models/Project.js', () => ({
  default: {
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../models/Board.js', () => ({
  default: {
    findAll: vi.fn(),
  },
}));

vi.mock('../models/User.js', () => ({
  default: {
    init: vi.fn(),
  },
}));

describe('projectController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      user: { sub: 'test-user-123' },
      params: {},
      query: {},
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe('createProject', () => {
    it('should return 401 if user not authenticated', async () => {
      mockReq.user = null;

      await createProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Authentication required.',
      });
    });

    it('should return 400 if name is missing', async () => {
      mockReq.body = { key: 'TEST' };

      await createProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Project name is required.',
      });
    });

    it('should return 400 if key is missing', async () => {
      mockReq.body = { name: 'Test Project' };

      await createProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Project key is required.',
      });
    });

    it('should return 400 if key format is invalid', async () => {
      mockReq.body = { name: 'Test Project', key: 'invalid-key!' };

      await createProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error:
          'Project key must be 1–10 alphanumeric characters (e.g. PROJ, APP1).',
      });
    });

    it('should return 409 if project key already exists', async () => {
      mockReq.body = { name: 'Test Project', key: 'TEST' };
      vi.mocked(Project.findOne).mockResolvedValue({ id: 'existing-project' });

      await createProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Project key 'TEST' is already in use.",
      });
    });

    it('should create a new project successfully', async () => {
      mockReq.body = {
        name: 'Test Project',
        key: 'TEST',
        description: 'Test description',
        category: 'development',
        status: 'active',
      };

      const mockCreatedProject = {
        id: 'proj-123',
        name: 'Test Project',
        key: 'TEST',
        description: 'Test description',
        category: 'development',
        status: 'active',
        owner_id: 'test-user-123',
      };

      vi.mocked(Project.findOne).mockResolvedValueOnce(null); // No existing project
      vi.mocked(Project.create).mockResolvedValue(mockCreatedProject);
      vi.mocked(Project.findOne).mockResolvedValueOnce(mockCreatedProject);

      await createProject(mockReq, mockRes, mockNext);

      expect(Project.create).toHaveBeenCalledWith({
        name: 'Test Project',
        key: 'TEST',
        description: 'Test description',
        category: 'development',
        status: 'active',
        owner_id: 'test-user-123',
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockCreatedProject);
    });

    it('should call next on error', async () => {
      mockReq.body = { name: 'Test Project', key: 'TEST' };
      const error = new Error('Database error');
      vi.mocked(Project.findOne).mockRejectedValue(error);

      await createProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getProjects', () => {
    it('should return paginated list of projects', async () => {
      mockReq.query = { page: 1, limit: 10 };
      const mockProjects = {
        count: 2,
        rows: [
          { id: 'proj-1', name: 'Project 1' },
          { id: 'proj-2', name: 'Project 2' },
        ],
      };

      vi.mocked(Project.findAndCountAll).mockResolvedValue(mockProjects);

      await getProjects(mockReq, mockRes, mockNext);

      expect(Project.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        include: expect.any(Array),
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        total: 2,
        page: 1,
        totalPages: 1,
        projects: mockProjects.rows,
      });
    });

    it('should filter projects by ownerId', async () => {
      mockReq.query = { ownerId: 'user-123' };
      vi.mocked(Project.findAndCountAll).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await getProjects(mockReq, mockRes, mockNext);

      expect(Project.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { owner_id: 'user-123' },
        })
      );
    });

    it('should filter projects by category and status', async () => {
      mockReq.query = { category: 'development', status: 'active' };
      vi.mocked(Project.findAndCountAll).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await getProjects(mockReq, mockRes, mockNext);

      expect(Project.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'development', status: 'active' },
        })
      );
    });

    it('should call next on error', async () => {
      const error = new Error('Database error');
      vi.mocked(Project.findAndCountAll).mockRejectedValue(error);

      await getProjects(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getProjectById', () => {
    it('should return 400 if no project id provided', async () => {
      mockReq.params = {};

      await getProjectById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Project Id not supplied',
      });
    });

    it('should return 404 if project not found', async () => {
      mockReq.params = { id: 'non-existent' };
      vi.mocked(Project.findOne).mockResolvedValue(null);

      await getProjectById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });

    it('should return project if found', async () => {
      mockReq.params = { id: 'proj-123' };
      const mockProject = { id: 'proj-123', name: 'Test Project' };
      vi.mocked(Project.findOne).mockResolvedValue(mockProject);

      await getProjectById(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockProject);
    });

    it('should call next on error', async () => {
      mockReq.params = { id: 'proj-123' };
      const error = new Error('Database error');
      vi.mocked(Project.findOne).mockRejectedValue(error);

      await getProjectById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getProjectBoards', () => {
    it('should return 404 if project not found', async () => {
      mockReq.params = { id: 'non-existent' };
      vi.mocked(Project.findOne).mockResolvedValue(null);

      await getProjectBoards(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });

    it('should return boards for project', async () => {
      mockReq.params = { id: 'proj-123' };
      const mockProject = { id: 'proj-123', name: 'Test Project' };
      const mockBoards = [
        { id: 'board-1', name: 'Board 1' },
        { id: 'board-2', name: 'Board 2' },
      ];

      vi.mocked(Project.findOne).mockResolvedValue(mockProject);
      vi.mocked(Board.findAll).mockResolvedValue(mockBoards);

      await getProjectBoards(mockReq, mockRes, mockNext);

      expect(Board.findAll).toHaveBeenCalledWith({
        where: { projectId: 'proj-123' },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockBoards);
    });

    it('should call next on error', async () => {
      mockReq.params = { id: 'proj-123' };
      const error = new Error('Database error');
      vi.mocked(Project.findOne).mockRejectedValue(error);

      await getProjectBoards(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateProject', () => {
    it('should return 404 if project not found', async () => {
      mockReq.params = { id: 'non-existent' };
      vi.mocked(Project.findOne).mockResolvedValue(null);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Project not found' });
    });

    it('should return 400 if key format is invalid', async () => {
      mockReq.params = { id: 'proj-123' };
      mockReq.body = { key: 'invalid-key!' };
      const mockProject = { id: 'proj-123', update: vi.fn(), reload: vi.fn() };
      vi.mocked(Project.findOne).mockResolvedValue(mockProject);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error:
          'Project key must be 1–10 alphanumeric characters (e.g. PROJ, APP1).',
      });
    });

    it('should return 409 if key already exists for another project', async () => {
      mockReq.params = { id: 'proj-123' };
      mockReq.body = { key: 'TEST' };
      const mockProject = { id: 'proj-123', update: vi.fn(), reload: vi.fn() };
      const existingProject = { id: 'other-project' };

      vi.mocked(Project.findOne)
        .mockResolvedValueOnce(mockProject)
        .mockResolvedValueOnce(existingProject);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Project key 'TEST' is already in use.",
      });
    });

    it('should update project successfully', async () => {
      mockReq.params = { id: 'proj-123' };
      mockReq.body = {
        name: 'Updated Project',
        description: 'Updated description',
        status: 'archived',
      };
      const mockProject = {
        id: 'proj-123',
        update: vi.fn().mockResolvedValue(),
        reload: vi.fn().mockResolvedValue(),
      };

      vi.mocked(Project.findOne).mockResolvedValue(mockProject);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockProject.update).toHaveBeenCalledWith({
        name: 'Updated Project',
        description: 'Updated description',
        status: 'archived',
      });
      expect(mockProject.reload).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockProject);
    });

    it('should call next on error', async () => {
      mockReq.params = { id: 'proj-123' };
      const error = new Error('Database error');
      vi.mocked(Project.findOne).mockRejectedValue(error);

      await updateProject(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
