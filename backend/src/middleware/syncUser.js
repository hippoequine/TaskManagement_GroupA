import { User } from '../models/models.js';

/**
 * A minimal user shape extracted from Keycloak token claims.
 * @typedef {Object} NormalizedTokenUser
 * @property {string|undefined} sub - Keycloak user id (JWT "sub")
 * @property {string} firstName - Derived from `name` or `preferred_username`
 * @property {string} lastName - Derived from `name` (may be empty)
 * @property {string|null} email - Email claim, may be null/missing
 * @property {string[]} roles - Realm roles (filtered elsewhere); may be empty
 */

/**
 * Extract a reasonable user profile from req.user (Keycloak token claims)
 *
 * Notes:
 * - If `name` is missing, falls back to `preferred_username`.
 * - `lastName` can be empty if no space-separated parts exist.
 *
 * @param {Object} tokenUser - req.user object populated by auth middleware
 * @param {string} [tokenUser.sub]
 * @param {string} [tokenUser.name]
 * @param {string} [tokenUser.preferred_username]
 * @param {string} [tokenUser.email]
 * @param {string[]} [tokenUser.roles]
 * @returns {NormalizedTokenUser} normalized user fields for DB sync
 */
function normalizeTokenUser(tokenUser) {
  const sub = tokenUser?.sub;
  const username = tokenUser?.preferred_username || 'User';
  const firstName = tokenUser?.name?.split?.(' ')?.[0] || username;
  const lastName = tokenUser?.name?.split?.(' ')?.slice?.(1)?.join?.(' ') || '';

  const email = tokenUser?.email || null;
  const roles = tokenUser?.roles || [];

  return { sub, firstName, lastName, email, roles };
}

/**
 * Choose a single "primary" role for the shadow User record.
 *
 * @param {string[]} [roles=[]] - role names from the token
 * @returns {'admin'|'developer'|'clinician'} selected primary role
 */
function pickPrimaryRole(roles = []) {
  const priority = ['admin', 'developer', 'clinician'];
  for (const r of priority) {
    if (roles.includes(r)) return r;
  }
  return 'developer'; // default fallback
}

/**
 * Resolve the user's timezone.
 *
 * Resolution order:
 * 1) request header `X-User-Timezone` (IANA string recommended, e.g. "America/Toronto")
 * 2) existing DB timezone (if present)
 * 3) fallback "UTC"
 *
 * @param {import('express').Request} req
 * @param {string|undefined|null} existingTz - timezone currently stored in DB
 * @returns {string} resolved timezone string
 */
function resolveTimezone(req, existingTz) {
  const headerTz = req.header('X-User-Timezone');
  return headerTz || existingTz || 'UTC';
}

/**
 * Middleware: upsert the current authenticated user into the local DB.
 *
 * Purpose:
 * - Keeps a local "shadow User" record in sync with Keycloak claims.
 * - Allows the rest of the app to reference Users via foreign keys (assignees, reporters, etc.).
 *
 * Behavior:
 * - Requires `req.user.sub` (set by verifyToken).
 * - Uses a TTL (5 minutes) to avoid writing on every request.
 * - On success, attaches the shadow record to `req.dbUser`.
 *
 * @param {import('express').Request & { user?: { sub?: string }, dbUser?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export async function syncUser(req, res, next) {
  try {
    if (!req.user?.sub) return next();
    // Checks if we've already synced this specific token session
    const existing = await User.findByPk(req.user.sub);
    // Only sync once every 5 minutes per user
    const SYNC_TTL_MS = 5 * 60 * 1000;

    const lastSyncedMs = existing?.lastSyncedAt
      ? existing.lastSyncedAt.getTime()
      : 0;

    const headerTz = req.header('X-User-Timezone');
    if (
      existing &&
      Date.now() - lastSyncedMs < SYNC_TTL_MS &&
      (!headerTz || headerTz === existing.timezone)
    ) {
      req.dbUser = existing.toJSON();
      return next();
    }

    // Performs Sync (only if data is stale or missing)
    const { sub, firstName, lastName, email, roles } = normalizeTokenUser(
      req.user
    );
    const role = pickPrimaryRole(roles);
    const timezone = resolveTimezone(req, existing?.timezone);

    const payload = {
      id: sub,
      firstName,
      lastName,
      email,
      role,
      timezone,
      lastSyncedAt: new Date(),
    };

    await User.upsert(payload);
    req.dbUser = payload;
    return next();
  } catch (err) {
    console.error('syncUser failed:', err);
    return next(err);
  }
}
