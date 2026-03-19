/**
 * Represents a Project workspace that groups related tickets and tasks.
 * Each project belongs to a single user.
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    key: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category: {
      type: DataTypes.ENUM('New Development', 'Maintenance'), //this can change
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('active', 'completed'),
      allowNull: false,
      defaultValue: 'active',
    },

    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default Project;
