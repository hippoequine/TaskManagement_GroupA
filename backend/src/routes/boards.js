import express from 'express';
import Board from '../models/Board.js';
import { getAllIssues } from '../controllers/issuesController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    next(err);
  }
});

// Filter this by boardId in the issuesController
router.get('/:boardId/issues', getAllIssues);

export default router;
