import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import issuesRouter from './issues.js';
import { syncUser } from '../middleware/syncUser.js';
import userRoutes from './users.js';

const router = express.Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use(verifyToken, syncUser);

router.use('/users', userRoutes);

/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token user + optional dbUser shadow record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     sub: { type: string }
 *                     email: { type: string, nullable: true }
 *                     name: { type: string, nullable: true }
 *                     preferred_username: { type: string, nullable: true }
 *                     roles:
 *                       type: array
 *                       items: { type: string }
 *                     iat: { type: integer, nullable: true }
 *                     dbUser:
 *                       allOf:
 *                         - $ref: '#/components/schemas/User'
 *                       nullable: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', (req, res) =>
  res.json({ user: { ...req.user, dbUser: req.dbUser ?? null } })
);

const handler = (req, res) => {
  res.json({ ok: true, role: req.user.roles });
};

/**
 * @openapi
 * /api/admin-only:
 *   get:
 *     summary: Admin-only test endpoint
 *     tags: [Authorization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 */
router.get('/admin-only', requireRole('admin'), handler);

/**
 * @openapi
 * /api/clinician-only:
 *   get:
 *     summary: Clinician-only test endpoint
 *     tags: [Authorization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 */
router.get('/clinician-only', requireRole('clinician'), handler);

/**
 * @openapi
 * /api/developer-only:
 *   get:
 *     summary: Developer-only test endpoint
 *     tags: [Authorization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 */
router.get('/developer-only', requireRole('developer'), handler);

router.use('/issues', issuesRouter);

export default router;
