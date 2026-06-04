const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  job_request_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  sender_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  sender_role: { type: DataTypes.ENUM('admin', 'provider', 'worker'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'chat_messages', underscored: true, createdAt: 'sent_at', updatedAt: false });

module.exports = ChatMessage;
