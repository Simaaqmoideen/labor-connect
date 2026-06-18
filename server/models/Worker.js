const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), unique: true },
  phone: { type: DataTypes.STRING(20), unique: true },
  password_hash: { type: DataTypes.STRING(255) },
  photo_url: { type: DataTypes.STRING(255) },
  bio: { type: DataTypes.TEXT },
  skills: { type: DataTypes.JSON, defaultValue: [] },
  category: { type: DataTypes.STRING(100) },
  experience_yrs: { type: DataTypes.INTEGER, defaultValue: 0 },
  wage_per_day: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  working_area: { type: DataTypes.STRING(200) },
  availability: { type: DataTypes.ENUM('available', 'busy', 'offline'), defaultValue: 'offline' },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating_avg: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  lat: { type: DataTypes.DECIMAL(10, 8) },
  lng: { type: DataTypes.DECIMAL(11, 8) },
  // Level System fields
  level: { type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'), defaultValue: 'bronze' },
  level_points: { type: DataTypes.INTEGER, defaultValue: 0 },
  jobs_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
  reliability_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.00 },
  attendance_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.00 },
  acceptance_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.00 },
  verification_badges: { type: DataTypes.JSON, defaultValue: null }
}, { tableName: 'workers', underscored: true });

module.exports = Worker;
