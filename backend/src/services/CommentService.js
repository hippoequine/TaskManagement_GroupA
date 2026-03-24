import { Comment, Issue } from '../models/model.js';

const addComment = async (issueId, body, currentUser) => {
  const issue = await Issue.findByPk(issueId);
  if (!issue) {
    const error404 = new Error('Issue not found');
    error404.status = 404;
    throw error404;
  }

  if (!body || !body.trim()) {
    const error400 = new Error('Comment body is required');
    error400.status = 400;
    throw error400;
  }

  const comment = await Comment.create({
    body,
    issueId,
    authorId: currentUser.sub,
  });

  return comment;
};

const editComment = async (commentId, body, currentUser) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    const error404 = new Error('Comment not found');
    error404.status = 404;
    throw error404;
  }

  if (!body || !body.trim()) {
    const error400 = new Error('Comment body is required');
    error400.status = 400;
    throw error400;
  }

  if (
    comment.authorId !== currentUser.sub &&
    !currentUser.roles.includes('admin')
  ) {
    const error401 = new Error('You are not allowed to edit this comment');
    error401.status = 401;
    throw error401;
  }
  comment.body = body.trim();
  await comment.save();

  return comment;
};

const deleteComment = async (commentId, currentUser) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    const error404 = new Error('Comment not found');
    error404.status = 404;
    throw error404;
  }
  if (
    comment.authorId !== currentUser.sub &&
    !currentUser.roles.includes('admin')
  ) {
    const error401 = new Error('You are not allowed to edit this comment');
    error401.status = 401;
    throw error401;
  }

  await comment.destroy();

  return { message: 'Comment successfully deleted.' };
};

const listByIssue = async (issueId) => {
  const issue = await Issue.findByPk(issueId);
  if (!issue) {
    const error403 = new Error('Issue not found');
    error403.status = 404;
    throw error403;
  }

  const comments = await Comment.findAll({
    where: { issueId },
    order: [['createdAt', 'ASC']],
  });

  return comments;
};

export { addComment, editComment, deleteComment, listByIssue };
