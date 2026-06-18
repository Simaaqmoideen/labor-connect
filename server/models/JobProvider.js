const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobProvider = sequelize.define('JobProvider', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), unique: true },
  phone: { type: DataTypes.STRING(20), unique: true },
  password_hash: { type: DataTypes.STRING(255) },
  company_name: { type: DataTypes.STRING(150) },
  profile_photo: { type: DataTypes.STRING(255) },
  address: { type: DataTypes.TEXT },
  lat: { type: DataTypes.DECIMAL(10, 8) },
  lng: { type: DataTypes.DECIMAL(11, 8) },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_suspended: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'job_providers', underscored: true });

module.exports = JobProvider;
