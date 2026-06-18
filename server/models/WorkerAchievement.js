const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkerAchievement = sequelize.define('WorkerAchievement', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  worker_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type: {
    type: DataTypes.ENUM('badge', 'milestone', 'certification', 'level_up'),
    allowNull: false
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING(50) },
  earned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'worker_achievements', underscored: true, timestamps: false });

module.exports = WorkerAchievement;
