import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true }, // keycloak sub
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('admin', 'developer', 'clinician'),
      allowNull: false,
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    timezone: { type: DataTypes.STRING, allowNull: false },
    lastSyncedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
    indexes: [{ fields: ['email'] }],
  }
);

export default User;
