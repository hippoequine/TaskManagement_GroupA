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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    owner_id: {
      type: DataTypes.STRING,
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
