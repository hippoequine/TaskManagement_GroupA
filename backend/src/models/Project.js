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
      type: DataTypes.INTEGER,
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
