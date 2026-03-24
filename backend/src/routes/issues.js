import express from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueByID,
  updateIssue,
  deleteIssue,
} from '../controllers/issuesController.js';
import { requireWorkflowCompliance } from '../middleware/workflow.js';
import {
  checkIssueView,
  checkIssueModify,
  checkIssueDelete,
} from '../middleware/permissions.js';
import {
  createComment,
  getCommentByIssue,
} from '../controllers/commentsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// post
router.post('/', checkIssueModify, createIssue);

// get all issues (with filtering)
router.get('/', checkIssueView, getAllIssues);

// get by ID
router.get('/:id', checkIssueView, getIssueByID);

// patch
router.patch('/:id', checkIssueModify, requireWorkflowCompliance, updateIssue);

// delete
router.delete('/:id', checkIssueDelete, deleteIssue);

/**
 * @openapi
 * /api/issues/{id}/comments:
 *   post:
 *     summary: Create a comment on an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Issue ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 example: "This issue occurs when clicking submit."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Comment body is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.post('/:id/comments', verifyToken, createComment);

/**
 * @openapi
 * /api/issues/{id}/comments:
 *   get:
 *     summary: List comments for an issue
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Issue ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.get('/:id/comments', verifyToken, getCommentByIssue);

export default router;
