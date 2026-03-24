import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import { projectsApi } from '../api/projectsApi';
import api from '../api/axios';

describe('projectsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll calls GET /projects without params', () => {
    projectsApi.getAll();
    expect(api.get).toHaveBeenCalledWith('/projects', { params: undefined });
  });

  it('getAll passes pagination params', () => {
    projectsApi.getAll({ page: 2, limit: 5 });
    expect(api.get).toHaveBeenCalledWith('/projects', {
      params: { page: 2, limit: 5 },
    });
  });

  it('getById calls GET /projects/:id', () => {
    projectsApi.getById('abc-123');
    expect(api.get).toHaveBeenCalledWith('/projects/abc-123');
  });

  it('create calls POST /projects with payload', () => {
    const payload = { name: 'Test Project', key: 'TEST' };
    projectsApi.create(payload);
    expect(api.post).toHaveBeenCalledWith('/projects', payload);
  });

  it('update calls PUT /projects/:id with payload', () => {
    const payload = { name: 'Updated', status: 'completed' };
    projectsApi.update('abc-123', payload);
    expect(api.put).toHaveBeenCalledWith('/projects/abc-123', payload);
  });
});
