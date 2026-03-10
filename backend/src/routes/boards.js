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

router.post('/', async (req, res, next) => {
  try {
    const { title, projectId } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!projectId)
      return res.status(400).json({ message: 'Parent Project Id is required' });
    const newBoard = await Board.create({ title, projectId });
    res.status(201).json(newBoard);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    // Only thing updatable is the title
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ message: 'No title supplied to update' });
    const board = await Board.findByPk(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    board.title = title;
    await board.save();
    res.json(board);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    await board.destroy();
    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
