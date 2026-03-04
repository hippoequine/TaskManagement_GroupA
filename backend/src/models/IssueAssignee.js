import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const IssueAssignee = sequelize.define(
  'IssueAssignee',
  {
    issueId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
  },
  {
    indexes: [
      { unique: true, fields: ['issueId', 'userId'] },
      { fields: ['userId'] },
    ],
  }
);

export default IssueAssignee;
