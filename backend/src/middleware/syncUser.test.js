import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { syncUser } from './syncUser';
import { User } from '../models/models';

// Mock Sequelize model layer
vi.mock('../models/models.js', () => ({
  User: {
    findByPk: vi.fn(),
    upsert: vi.fn(),
  },
}));

describe('syncUser middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-14T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const makeReq = ({ user, headerTz } = {}) => ({
    user,
    header: vi.fn((name) =>
      name === 'X-User-Timezone' ? headerTz : undefined
    ),
  });

  it('calls next() and does nothing if req.user.sub is missing', async () => {
    const req = makeReq({ user: {} });
    const _res = {};
    const next = vi.fn();
    await syncUser(req, _res, next);

    expect(User.findByPk).not.toHaveBeenCalled();
    expect(User.upsert).not.toHaveBeenCalled();
    expect(req.dbUser).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it('skips upsert when existing user is within TTL and timezone unchanged (or header missing)', async () => {
    const existing = {
      timezone: 'UTC',
      lastSyncedAt: new Date(Date.now() - 60 * 1000), // 1 minute ago
      toJSON: () => ({ id: 'sub-1', timezone: 'UTC' }),
    };
    User.findByPk.mockResolvedValue(existing);

    const req = makeReq({
      user: {
        sub: 'sub-1',
        preferred_username: 'testadmin',
        name: 'Test Admin',
        email: 'test@example.com',
        roles: ['admin'],
      },
      headerTz: undefined, // no timezone header
    });

    const _res = {};
    const next = vi.fn();

    await syncUser(req, _res, next);

    expect(User.findByPk).toHaveBeenCalledWith('sub-1');
    expect(User.upsert).not.toHaveBeenCalled();
    expect(req.dbUser).toEqual({ id: 'sub-1', timezone: 'UTC' });
    expect(next).toHaveBeenCalledOnce();
  });

  it('does upsert when existing user within TTL but timezone header differs', async () => {
    const existing = {
      timezone: 'UTC',
      lastSyncedAt: new Date(Date.now() - 60 * 1000), // within TTL
      toJSON: () => ({ id: 'sub-1', timezone: 'UTC' }),
    };

    User.findByPk.mockResolvedValue(existing);
    User.upsert.mockResolvedValue([{}, true]);

    const req = makeReq({
      user: {
        sub: 'sub-1',
        preferred_username: 'testadmin',
        name: 'Test Admin',
        email: 'test@example.com',
        roles: ['admin'],
      },
      headerTz: 'America/Los_Angeles',
    });

    const _res = {};
    const next = vi.fn();

    await syncUser(req, _res, next);
    expect(User.upsert).toHaveBeenCalledOnce();

    // verify timezone being written from header
    const payload = User.upsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      id: 'sub-1',
      email: 'test@example.com',
      role: 'admin',
      timezone: 'America/Los_Angeles',
    });

    expect(req.dbUser).toMatchObject({
      id: 'sub-1',
      timezone: 'America/Los_Angeles',
    });

    expect(next).toHaveBeenCalledOnce();
  });

  it('does upsert when user does not exist', async () => {
    User.findByPk.mockResolvedValue(null);
    User.upsert.mockResolvedValue([{}, true]);

    const req = makeReq({
      user: {
        sub: 'sub-2',
        preferred_username: 'dev1',
        name: 'Dev One',
        email: 'dev1@example.com',
        roles: ['developer'],
      },
      headerTz: 'Asia/Kolkata',
    });

    const _res = {};
    const next = vi.fn();

    await syncUser(req, _res, next);

    expect(User.findByPk).toHaveBeenCalledWith('sub-2');
    expect(User.upsert).toHaveBeenCalledOnce();

    const payload = User.upsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      id: 'sub-2',
      firstName: 'Dev',
      lastName: 'One',
      email: 'dev1@example.com',
      role: 'developer',
      timezone: 'Asia/Kolkata',
    });

    expect(req.dbUser).toMatchObject({
      id: 'sub-2',
      timezone: 'Asia/Kolkata',
    });

    expect(next).toHaveBeenCalledOnce();
  });

  it('calls next(err) if DB throws', async () => {
    User.findByPk.mockRejectedValue(new Error('DB down'));

    const req = makeReq({
      user: {
        sub: 'sub-3',
        preferred_username: 'clin1',
        name: 'Clin One',
        email: 'clin1@example.com',
        roles: ['clinician'],
      },
      headerTz: 'UTC',
    });

    const _res = {};
    const next = vi.fn();

    await syncUser(req, _res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('DB down');
  });
});
