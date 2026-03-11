import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class IssueBoard extends Model {}

IssueBoard.init(
  {
    issueId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    boardId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'IssueBoard',
    timestamps: false,
  }
);

export default IssueBoard;
