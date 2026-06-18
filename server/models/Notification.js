const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_role: { type: DataTypes.ENUM('admin', 'provider', 'worker'), allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  body: { type: DataTypes.TEXT },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  job_request_id: { type: DataTypes.INTEGER.UNSIGNED }
}, { tableName: 'notifications', underscored: true, updatedAt: false });

module.exports = Notification;
