import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

import projectRouter from './projectRoutes.js';

vi.mock('../controllers/projectController.js', () => ({
  createProject: vi.fn((req, res) =>
    res.status(201).json({ success: true, message: 'created' })
  ),
  getProjects: vi.fn((req, res) =>
    res.status(200).json({ success: true, projects: [] })
  ),
  getProjectById: vi.fn((req, res) =>
    res.status(200).json({ success: true, project: { id: 'abc' } })
  ),
  getProjectBoards: vi.fn((req, res) =>
    res.status(200).json({ success: true, boards: [] })
  ),
  updateProject: vi.fn((req, res) =>
    res.status(200).json({ success: true, message: 'updated' })
  ),
}));

const app = express();
app.use(express.json());
app.use('/projects', projectRouter);

describe('Project Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /projects calls createProject', async () => {
    const res = await request(app)
      .post('/projects')
      .send({ name: 'Test', key: 'TEST' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /projects calls getProjects', async () => {
    const res = await request(app).get('/projects');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  it('GET /projects/:id calls getProjectById', async () => {
    const res = await request(app).get('/projects/abc-123');

    expect(res.status).toBe(200);
    expect(res.body.project.id).toBe('abc');
  });

  it('GET /projects/:id/boards calls getProjectBoards', async () => {
    const res = await request(app).get('/projects/abc-123/boards');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.boards)).toBe(true);
  });

  it('PUT /projects/:id calls updateProject', async () => {
    const res = await request(app)
      .put('/projects/abc-123')
      .send({ name: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
