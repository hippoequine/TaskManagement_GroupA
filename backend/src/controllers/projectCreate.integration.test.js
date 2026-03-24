import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../models/Project.js', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../models/Board.js', () => ({
  default: {},
}));

vi.mock('../models/User.js', () => ({
  default: {},
}));

import Project from '../models/Project.js';
import { createProject } from './projectController.js';

function makeReq(overrides = {}) {
  return {
    user: { sub: 'user-123' },
    body: {
      name: 'Task Manager',
      key: 'tm',
      description: 'Main project',
      category: 'Maintenance',
      status: 'active',
    },
    ...overrides,
  };
}

function makeRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe('createProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the user is missing', async () => {
    const req = makeReq({ user: null });
    const res = makeRes();

    await createProject(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication required.',
    });
  });

  it('returns 400 when the name is missing', async () => {
    const req = makeReq({ body: { ...makeReq().body, name: '' } });
    const res = makeRes();

    await createProject(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Project name is required.',
    });
  });

  it('returns 400 when the key is missing', async () => {
    const req = makeReq({ body: { ...makeReq().body, key: '' } });
    const res = makeRes();

    await createProject(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Project key is required.',
    });
  });

  it('returns 400 when the key format is invalid', async () => {
    const req = makeReq({ body: { ...makeReq().body, key: 'bad-key!' } });
    const res = makeRes();

    await createProject(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        'Project key must be 1–10 alphanumeric characters (e.g. PROJ, APP1).',
    });
  });

  it('returns 409 when the key is already in use', async () => {
    const req = makeReq();
    const res = makeRes();

    Project.findOne.mockResolvedValue({ id: 'existing-project' });

    await createProject(req, res, vi.fn());

    expect(Project.findOne).toHaveBeenCalledWith({
      where: { key: 'TM' },
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Project key 'TM' is already in use.",
    });
  });

  it('creates the project when the payload is valid', async () => {
    const req = makeReq();
    const res = makeRes();

    Project.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 'project-1',
      name: 'Task Manager',
      key: 'TM',
      description: 'Main project',
      category: 'Maintenance',
      status: 'active',
      owner: {
        id: 'user-123',
        firstName: 'Alex',
        lastName: 'Li',
        email: 'alex@example.com',
      },
    });
    Project.create.mockResolvedValue({ id: 'project-1' });

    await createProject(req, res, vi.fn());

    expect(Project.create).toHaveBeenCalledWith({
      name: 'Task Manager',
      key: 'TM',
      description: 'Main project',
      category: 'Maintenance',
      status: 'active',
      owner_id: 'user-123',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'project-1',
        key: 'TM',
      })
    );
  });

  it('passes unexpected errors to next', async () => {
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();
    const error = new Error('DB error');

    Project.findOne.mockRejectedValue(error);

    await createProject(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
