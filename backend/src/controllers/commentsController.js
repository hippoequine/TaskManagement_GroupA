import {
  addComment,
  editComment,
  deleteComment,
  listByIssue,
} from '../services/CommentService.js';

export const createComment = async (req, res) => {
  try {
    const issueId = req.params.id;
    const { body } = req.body;
    const user = req.user;
    const comment = await addComment(issueId, body, user);

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.error('Error leaving comment', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      error: err.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { body } = req.body;
    const currentUser = req.user;

    const comment = await editComment(commentId, body, currentUser);
    res.status(200).json(comment);
  } catch (err) {
    console.error('Error updating comment', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      error: err.message,
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const currentUser = req.user;

    const result = await deleteComment(commentId, currentUser);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error deleting comment', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      error: err.message,
    });
  }
};

export const getCommentByIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const comments = await listByIssue(issueId);
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error getting comments', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      error: err.message,
    });
  }
};
