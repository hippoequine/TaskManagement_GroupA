/**
 * Defines API endpoints for creating and retrieving projects.
 */

import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBoards
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);

router.get('/', getProjects);

router.get('/:id', getProjectById);

router.get('/:id/boards', getProjectBoards);

export default router;
