/**
 * Contains request handlers for Project-related API endpoints.
 * All routes assume the user is authenticated and available on req.user.
 */
import Project from '../models/Project.js';

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const { name, description, key } = req.body;

    if (!name || !key) {
      return res.status(400).json({
        error: 'Project name and key are required',
      });
    }

    const normalizedKey = key.toUpperCase();

    const existing = await Project.findOne({
      where: { key: normalizedKey },
    });

    if (existing) {
      return res.status(400).json({
        error: 'Project key already exists',
      });
    }

    const project = await Project.create({
      name,
      key: normalizedKey,
      description,
      owner_id: req.user.sub,
    });

    res.status(201).json(project);
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

    const { count, rows } = await Project.findAndCountAll({
      where: { owner_id: req.user.sub },
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({
      total: count,
      page,
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
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};
