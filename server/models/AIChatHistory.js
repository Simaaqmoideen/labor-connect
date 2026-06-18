const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIChatHistory = sequelize.define('AIChatHistory', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_role: {
    type: DataTypes.ENUM('admin', 'provider', 'worker'),
    allowNull: false
  },
  message: { type: DataTypes.TEXT, allowNull: false },
  response: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING(10), defaultValue: 'en' }
}, { tableName: 'ai_chat_history', underscored: true, updatedAt: false });

module.exports = AIChatHistory;
