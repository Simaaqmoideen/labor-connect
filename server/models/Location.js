const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_role: { type: DataTypes.ENUM('admin', 'provider', 'worker'), allowNull: false },
  lat: { type: DataTypes.DECIMAL(10, 8) },
  lng: { type: DataTypes.DECIMAL(11, 8) }
}, { 
  tableName: 'locations', 
  underscored: true, 
  createdAt: false, 
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'user_role']
    }
  ]
});

module.exports = Location;
