import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyToken } from './auth.js';
import * as jose from 'jose';
import { getJWKS } from '../config/keycloak.js';

vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

vi.mock('../config/keycloak.js', () => ({
  getJWKS: vi.fn(),
}));

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 if no authorization header is present', async () => {
    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: 'Missing or invalid authorization header',
      })
    );
  });

  it('should return 401 if token verification fails', async () => {
    req.headers.authorization = 'Bearer invalid-token';

    getJWKS.mockReturnValue({});
    jose.jwtVerify.mockRejectedValue(new Error('Invalid token'));

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid or expired token',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user to req and call next when token is valid', async () => {
    req.headers.authorization = 'Bearer valid-token';

    getJWKS.mockReturnValue({});
    jose.jwtVerify.mockResolvedValue({
      payload: {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferred_username: 'testuser',
        realm_access: {
          roles: ['developer'],
        },
      },
    });

    await verifyToken(req, res, next);

    expect(req.user).toEqual({
      sub: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      preferred_username: 'testuser',
      roles: ['developer'],
    });

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
