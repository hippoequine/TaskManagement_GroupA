import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issueId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
    timestamps: true,
  }
);

export default Comment;
