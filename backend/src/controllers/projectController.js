/**
 * Contains request handlers for Project-related API endpoints.
 * All routes assume the user is authenticated and available on req.user.
 */
import Project from '../models/Project.js';
import Board from '../models/Board.js';
import User from '../models/User.js';

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { name, key, description, category, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required.' });
    }
    if (!key) {
      return res.status(400).json({ error: 'Project key is required.' });
    }

    const normalizedKey = key.trim().toUpperCase();

    //Key format validation
    if (!/^[A-Z0-9]{1,10}$/.test(normalizedKey)) {
      return res.status(400).json({
        error:
          'Project key must be 1–10 alphanumeric characters (e.g. PROJ, APP1).',
      });
    }

    //Validation checks can go here

    const existing = await Project.findOne({
      where: { key: normalizedKey },
    });
    if (existing) {
      return res.status(409).json({
        error: `Project key '${normalizedKey}' is already in use.`,
      });
    }

    const project = await Project.create({
      name,
      key: normalizedKey,
      description,
      category: category || null,
      status: status || 'active',
      owner_id: req.user.sub,
    });

    const created = await Project.findOne({
      where: { id: project.id },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

//GET /api/projects?page=&limit=
export const getProjects = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.category) {
      where.category = req.query.category;
    }
    if (req.query.status) {
      where.status = req.query.status;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      projects: rows,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.sub,
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id/boards
export const getProjectBoards = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, owner_id: req.user.sub },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const boards = await Board.findAll({ where: { projectId: req.params.id } });
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, owner_id: req.user.sub },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { name, key, description, category, status } = req.body;

    if (key) {
      const normalizedKey = key.trim().toUpperCase();
      if (!/^[A-Z0-9]{1,10}$/.test(normalizedKey)) {
        return res.status(400).json({
          error:
            'Project key must be 1–10 alphanumeric characters (e.g. PROJ, APP1).',
        });
      }
      const existing = await Project.findOne({ where: { key: normalizedKey } });
      if (existing && existing.id !== project.id) {
        return res
          .status(409)
          .json({ error: `Project key '${normalizedKey}' is already in use.` });
      }
      req.body.key = normalizedKey;
    }

    await project.update({
      name,
      key: req.body.key,
      description,
      category,
      status,
    });
    await project.reload({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json(project);
  } catch (err) {
    next(err);
  }
};
