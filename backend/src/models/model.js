import User from './User.js';
import Issue from './Issue.js';
import Comment from './Comment.js';
import IssueAssignee from './IssueAssignee.js';
import Attachment from './Attachment.js';
import Board from './Board.js';
import AttachmentProject from './AttachmentProject.js';
import Project from './Project.js';

// =============== Associations ===============

export function applyAssociations() {
  // User -> Issues (reporter)
  Issue.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
  User.hasMany(Issue, { as: 'reportedIssues', foreignKey: 'reporterId' });

  // Attachment -> Project links
  Attachment.hasMany(AttachmentProject, {
    as: 'projectLinks',
    foreignKey: 'attachmentId',
    onDelete: 'CASCADE',
  });
  AttachmentProject.belongsTo(Attachment, {
    as: 'attachment',
    foreignKey: 'attachmentId',
  });

  // User -> Attachment (uploader)
  User.hasMany(Attachment, {
    as: 'uploadedAttachments',
    foreignKey: 'uploadedBy',
  });
  Attachment.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });

  // assignees (many-to-many)
  Issue.belongsToMany(User, {
    through: IssueAssignee,
    as: 'assignees',
    foreignKey: 'issueId',
    otherKey: 'userId',
  });

  User.belongsToMany(Issue, {
    through: IssueAssignee,
    as: 'assignedIssues',
    foreignKey: 'userId',
    otherKey: 'issueId',
  });

  // Issue -> Comment
  Issue.hasMany(Comment, {
    as: 'comment',
    foreignKey: 'issueId',
    onDelete: 'CASCADE',
  });
  Comment.belongsTo(Issue, { as: 'issue', foreignKey: 'issueId' });

  // user -> Comment (author)
  User.hasMany(Comment, {
    as: 'comment',
    foreignKey: 'authorId',
  });
  Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

  // parent/subIssues (self reference)
  Issue.belongsTo(Issue, { as: 'parent', foreignKey: 'parentIssueId' });
  Issue.hasMany(Issue, { as: 'subIssues', foreignKey: 'parentIssueId' });

  Issue.belongsTo(Board, {
    as: 'board',
    foreignKey: 'boardId',
  });

  Board.hasMany(Issue, {
    as: 'issues',
    foreignKey: 'boardId',
  });

  // Project owner
  Project.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
  User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'owner_id' });
}

export {
  Issue,
  IssueAssignee,
  User,
  Attachment,
  AttachmentProject,
  Board,
  Comment,
  Project,
};
