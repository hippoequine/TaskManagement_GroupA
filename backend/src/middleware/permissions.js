import { Issue } from '../models/model.js'; //look up existing issues in database

/**
 * Checks permission to READ/VIEW issues
 * All developer and admin can view issues (read only)
 * Other roles should not have access to the project or board
 */

export const checkIssueView = async (req, res, next) => {
  //current logged-in user
  const user = req.dbUser;

  if (!user) {
    return res
      .status(401)
      .json({ message: 'Access Denied: no user session found' });
  }

  if (user.role === 'admin' || user.role === 'developer') {
    //allow to view
    return next();
  }

  return res.status(403).json({
    message: `Access Denied: your role '${user.role}' is not allowed to view issues. Only developers and admins can view issues.`,
  });
};

/**
 * Check permissions to create or update issue
 * Only project members (reporter + assignmees) or admins can modify issue
 */

export const checkIssueModify = async (req, res, next) => {
  try {
    const user = req.dbUser;
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Access Denied: no user session found' });
    }

    //Admins can always modify
    if (user.role === 'admin') {
      return next();
    }

    // Creating new issue (no ID yet)
    if (!req.params.id) {
      //developer can create issue
      if (user.role === 'developer') {
        return next();
      }

      return res.status(403).json({
        message: `Access Denied: only developers and admins can create new issues. Your role: '${user.role}'`,
      });
    }

    //Updating existing issue
    const issue = await Issue.findByPk(req.params.id, {
      include: [{ association: 'assignees', attributes: ['id'] }],
    });

    if (!issue) {
      return res
        .status(404)
        .json({ message: 'Access Denied: Issue not found' });
    }

    const isReporter = issue.reporterId === user.id;
    const isAssignee = issue.assignees.some((a) => a.id === user.id);

    if (isReporter || isAssignee) {
      //allow to modify issue
      return next();
    }

    return res.status(403).json({
      message: `Access Denied: you are not a project member of this issue and cannot modify it. Only the reporter, assigned developers, or admins can modify issues.`,
    });
  } catch (err) {
    console.error('Modify permission error: ', err);
    return res
      .status(500)
      .json({ message: 'Server error checking modify permission' });
  }
};

/**
 * Check permission to delete issue
 * Only reporter or admin can delete issues
 */

export const checkIssueDelete = async (req, res, next) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) {
      return res
        .status(404)
        .json({ message: 'Access Denied: Issue not found' });
    }

    const user = req.dbUser;
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Access Denied: no user session found' });
    }

    if (user.role === 'admin' || issue.reporterId === user.id) {
      //allow admin and reporter to delete issue
      return next();
    }

    return res.status(403).json({
      message:
        'Access Denied: only the admin or reporter of this issue can delete it.',
    });
  } catch (err) {
    console.error('Delete permission error: ', err);
    return res
      .status(500)
      .json({ message: 'Server error checking delete permission' });
  }
};
