import express from 'express';
import { Op } from 'sequelize';
import { User } from '../models/model.js';

const router = express.Router();

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     summary: Search users (for assignee picker)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search term (name or email)
 *     responses:
 *       200:
 *         description: Matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string, format: uuid }
 *                   fullName: { type: string }
 *                   email: { type: string, nullable: true }
 *                   role: { type: string }
 *                   timezone: { type: string }
 *       400:
 *         description: Missing or empty query param `q`
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string }
 *       401:
 *         description: Unauthorized
 */
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q ?? '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Query param `q` is required' });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
      limit: 20,
      order: [['lastName', 'ASC']],
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'timezone'],
    });

    const safe = users.map((u) => ({
      id: u.id,
      fullName: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      role: u.role,
      timezone: u.timezone,
    }));
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [['lastName', 'ASC']],
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'timezone',
        'createdAt',
      ],
    });

    const safe = users.map((u) => ({
      id: u.id,
      fullName: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      role: u.role,
      timezone: u.timezone,
      createdAt: u.createdAt,
    }));
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

export default router;
