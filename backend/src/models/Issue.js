import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Issue extends Model {}

Issue.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM('bug', 'task', 'subtask', 'story', 'epic'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'backlog',
        'in_progress',
        'reviewed',
        'done',
        'archived'
      ),
      allowNull: false,
      defaultValue: 'backlog',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: true,
    },
    storyPoints: { type: DataTypes.INTEGER, allowNull: true },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    reporterId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    boardId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parentIssueId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Issue',
    timestamps: true,
    indexes: [
      { fields: ['reporterId'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['priority'] },
      { fields: ['parentIssueId'] },
    ],
  }
);

export default Issue;
