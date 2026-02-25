import User from './User.js';
import Issue from './Issue.js';
import IssueAssignee from './IssueAssignee.js';
import Attachment from './Attachment.js';

// =============== Associations ===============

export function applyAssociations() {
  // User -> Issues (reporter)
  Issue.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
  User.hasMany(Issue, { as: 'reportedIssues', foreignKey: 'reporterId' });

  // Issue -> Attachment
  Issue.hasMany(Attachment, {
    as: 'attachments',
    foreignKey: 'issueId',
    onDelete: 'CASCADE',
  });
  Attachment.belongsTo(Issue, { as: 'issue', foreignKey: 'issueId' });

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

  // parent/subIssues (self reference)
  Issue.belongsTo(Issue, { as: 'parent', foreignKey: 'parentIssueId' });
  Issue.hasMany(Issue, { as: 'subIssues', foreignKey: 'parentIssueId' });
}

export { Issue, IssueAssignee, User, Attachment };
