const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkVerification = sequelize.define('WorkVerification', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  job_request_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  before_image_url: { type: DataTypes.STRING(500) },
  after_image_url: { type: DataTypes.STRING(500) },
  confidence_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: null },
  completion_status: {
    type: DataTypes.ENUM('pending', 'completed', 'partial', 'failed'),
    defaultValue: 'pending'
  },
  verified_at: { type: DataTypes.DATE }
}, { tableName: 'work_verifications', underscored: true });

module.exports = WorkVerification;
