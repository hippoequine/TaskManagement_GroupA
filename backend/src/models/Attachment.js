import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Attachment extends Model {}

Attachment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    uploadedBy: {
      type: DataTypes.UUID, // references User.id
      allowNull: false,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM('IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER'),
      allowNull: false,
    },

    hasInlinePreview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    createdAtUTC: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Attachment',
    tableName: 'attachments',
    timestamps: false,
  }
);

export default Attachment;
