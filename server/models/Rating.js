const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  job_request_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  reviewer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  reviewer_role: { type: DataTypes.ENUM('admin', 'provider', 'worker'), allowNull: false },
  reviewee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  reviewee_role: { type: DataTypes.ENUM('admin', 'provider', 'worker'), allowNull: false },
  rating: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  review_text: { type: DataTypes.TEXT }
}, { tableName: 'ratings_reviews', underscored: true, updatedAt: false });

module.exports = Rating;
