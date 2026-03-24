import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../testApp.js';
import sequelize from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Board from '../models/Board.js';

describe('POST /api/issues - Create Issue Integration Test', () => {
  let testUser;
  let testBoard;
  const testUserId = '31a72426-3f36-4ba9-af6c-cb942643874a';

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    testUser = await User.create({
      id: testUserId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'developer',
      timezone: 'UTC',
      lastSyncedAt: new Date(),
    });

    const testProject = await Project.create({
      name: 'Test Project',
      key: 'TEST',
      owner_id: testUser.id,
    });

    testBoard = await Board.create({
      title: 'Test Board',
      projectId: testProject.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new issue and return 201 status', async () => {
    const payload = {
      title: 'Integration Test Issue',
      type: 'bug',
      description: 'Test description',
      priority: 'high',
      storyPoints: 3,
      reporterId: testUser.id,
      boardId: testBoard.id,
      dueDate: new Date('2025-12-31').toISOString(),
    };

    const response = await request(app).post('/api/issues').send(payload);

    console.log('Create response status:', response.status);
    console.log(
      'Create response body:',
      JSON.stringify(response.body, null, 2)
    );

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.issue).toHaveProperty('id');
    expect(response.body.issue.title).toBe(payload.title);
  });

  it('should return 400 when title is missing', async () => {
    const payload = {
      type: 'bug',
      description: 'Missing title test',
      reporterId: testUser.id,
      boardId: testBoard.id,
    };

    const response = await request(app).post('/api/issues').send(payload);

    console.log('Missing title response status:', response.status);
    console.log(
      'Missing title response body:',
      JSON.stringify(response.body, null, 2)
    );

    expect(response.status).toBe(400);
  });
});
