import express from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueByID,
  updateIssue,
  deleteIssue,
} from '../controllers/issuesController.js';

const router = express.Router();

// post
router.post('/', createIssue);

// get all issues (with filtering)
router.get('/', getAllIssues);

// get by ID
router.get('/:id', getIssueByID);

// patch
router.patch('/:id', updateIssue);

// delete
router.delete('/:id', deleteIssue);

export default router;
