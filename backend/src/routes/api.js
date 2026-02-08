import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import projectRoutes from './projectRoutes.js';

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

/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Current user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Missing or invalid token
 */
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

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
router.get('/admin-only', verifyToken, requireRole('admin'), handler);

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
router.get('/clinician-only', verifyToken, requireRole('clinician'), handler);

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
router.get('/developer-only', verifyToken, requireRole('developer'), handler);

router.use('/projects', verifyToken, projectRoutes);

export default router;
