import { Issue } from '../models/models.js';
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
    const issue = await Issue.findByPk(id);
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

    res.status(200).json({
      success: true,
      issue,
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

    const issues = await Issue.findAll({ where });

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
