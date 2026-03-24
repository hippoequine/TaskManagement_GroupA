import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

import issuesRouter from './issues.js';

// Mock the controller

vi.mock('../controllers/issuesController.js', () => ({
  createIssue: vi.fn((req, res) =>
    res.status(201).json({ success: true, message: 'created' })
  ),

  getAllIssues: vi.fn((req, res) =>
    res.status(200).json({ success: true, issues: [] })
  ),

  getIssueByID: vi.fn((req, res) =>
    res.status(200).json({ success: true, issue: { id: 1 } })
  ),

  updateIssue: vi.fn((req, res) =>
    res.status(200).json({ success: true, message: 'updated' })
  ),

  deleteIssue: vi.fn((req, res) =>
    res.status(200).json({ success: true, message: 'deleted' })
  ),
}));

// Mock middleware

vi.mock('../middleware/workflow.js', () => ({
  requireWorkflowCompliance: vi.fn((req, res, next) => next()),
}));

vi.mock('../middleware/permissions.js', () => ({
  checkIssueView: vi.fn((req, res, next) => next()),
  checkIssueModify: vi.fn((req, res, next) => next()),
  checkIssueDelete: vi.fn((req, res, next) => next()),
}));

vi.mock('../middleware/auth.js', () => ({
  verifyToken: vi.fn((req, res, next) => {
    req.user = { id: 1, roles: ['developer'] };
    next();
  }),
}));

// Mock comments controller

vi.mock('../controllers/commentsController.js', () => ({
  createComment: vi.fn((req, res) => res.status(201).json({ success: true })),
  getCommentByIssue: vi.fn((req, res) =>
    res.status(200).json({ success: true, comments: [] })
  ),
}));

const app = express();
app.use(express.json());
app.use('/issues', issuesRouter);

describe('Issues Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /issues calls createIssue', async () => {
    const res = await request(app).post('/issues').send({ title: 'New issue' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /issues returns list of issues', async () => {
    const res = await request(app).get('/issues');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /issues/:id returns an issue', async () => {
    const res = await request(app).get('/issues/1');

    expect(res.status).toBe(200);
    expect(res.body.issue.id).toBe(1);
  });

  it('PATCH /issues/:id updates an issue', async () => {
    const res = await request(app).patch('/issues/1').send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /issues/:id deletes an issue', async () => {
    const res = await request(app).delete('/issues/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST issues/:id/comments creates a comment on an issue', async () => {
    const res = await request(app)
      .post('/issues/1/comments')
      .send({ body: 'test comment', issueId: 1, authorId: 1 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET issues/:id/comments returns the comments on an issue', async () => {
    const res = await request(app).get('/issues/1/comments');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.comments).toEqual([]);
  });
});
