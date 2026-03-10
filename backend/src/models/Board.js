import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Board extends Model {}

Board.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    projectId: { type: DataTypes.UUID, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Board',
    timestamps: true,
    indexes: [{ fields: ['projectId'] }],
  }
);

export default Board;
