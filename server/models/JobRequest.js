const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobRequest = sequelize.define('JobRequest', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  provider_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  worker_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  work_location_lat: { type: DataTypes.DECIMAL(10, 8) },
  work_location_lng: { type: DataTypes.DECIMAL(11, 8) },
  work_location_address: { type: DataTypes.TEXT },
  expected_wage: { type: DataTypes.DECIMAL(10, 2) },
  is_urgent: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  scheduled_at: { type: DataTypes.DATE },
  completed_at: { type: DataTypes.DATE }
}, { tableName: 'job_requests', underscored: true });

module.exports = JobRequest;
