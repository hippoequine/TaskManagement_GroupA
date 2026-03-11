import { Issue, Board, User } from '../models/model.js';
import { Op } from 'sequelize';

export const createIssue = async (req, res) => {
  try {
    const {
      type,
      description,
      reporterId,
      priority,
      title,
      storyPoints,
      dueDate,
      boardIds,
      assigneeIds,
    } = req.body;

    const issue = await Issue.create({
      type,
      description,
      reporterId,
      priority,
      title,
      storyPoints,
      dueDate,
    });

    if (Array.isArray(boardIds) && boardIds.length > 0 && issue.setBoards) {
      await issue.setBoards(boardIds);
    }

    if (
      Array.isArray(assigneeIds) &&
      assigneeIds.length > 0 &&
      issue.setAssignees
    ) {
      await issue.setAssignees(assigneeIds);
    }

    res.status(201).json({
      success: true,
      issue,
    });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getIssueByID = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }
    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByPk(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    const allowedFields = [
      'type',
      'description',
      'reporterId',
      'priority',
      'status',
      'storyPoints',
      'dueDate',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await issue.update(updates);

    if (req.body.assigneeIds && Array.isArray(req.body.assigneeIds)) {
      if (issue.setAssignees) {
        await issue.setAssignees(req.body.assigneeIds);
      }
    }

    if (req.body.boardIds && Array.isArray(req.body.boardIds)) {
      if (issue.setBoards) {
        await issue.setBoards(req.body.boardIds);
      }
    }

    const updatedIssue = await Issue.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Board,
          as: 'boards',
          attributes: ['id', 'title'],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json({
      success: true,
      issue: updatedIssue,
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findByPk(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
    }

    await issue.destroy();

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const { search, type, reporterId, priority, status } = req.query;
    const boardId = req.params.boardId || req.params.id || null;

    const where = {};

    if (type) where.type = type;
    if (reporterId) where.reporterId = reporterId;
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const include = [];

    if (boardId) {
      include.push({
        model: Board,
        as: 'boards',
        where: { id: boardId },
        attributes: [],
        through: { attributes: [] },
        required: true,
      });
    }

    include.push({
      model: User,
      as: 'assignees',
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });

    const issues = await Issue.findAll({ where, include });

    res.status(200).json({
      success: true,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
