const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkerVerification = sequelize.define('WorkerVerification', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  worker_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  doc_type: {
    type: DataTypes.ENUM('aadhaar', 'government_id', 'skill_certificate', 'trade_license'),
    allowNull: false
  },
  doc_label: { type: DataTypes.STRING(200) },
  file_url: { type: DataTypes.STRING(500), allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  admin_notes: { type: DataTypes.TEXT },
  reviewed_by: { type: DataTypes.INTEGER.UNSIGNED },
  reviewed_at: { type: DataTypes.DATE }
}, { tableName: 'worker_verifications', underscored: true });

module.exports = WorkerVerification;
