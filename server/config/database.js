const { Sequelize } = require('sequelize');
const path = require('path');

// Use SQLite for local development (no MySQL server needed)
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'database.sqlite'),
      logging: false,
      define: { timestamps: true, underscored: true }
    });

module.exports = sequelize;
