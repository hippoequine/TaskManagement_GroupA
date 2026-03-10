import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AttachmentProject = sequelize.define(
  'AttachmentProject',
  {
    attachmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'attachment_projects',
    indexes: [
      { unique: true, fields: ['attachmentId'] },
      { fields: ['projectId'] },
    ],
  }
);

export default AttachmentProject;
