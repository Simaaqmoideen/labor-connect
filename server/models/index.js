const sequelize = require('../config/database');

const Admin = require('./Admin');
const JobProvider = require('./JobProvider');
const Worker = require('./Worker');
const JobRequest = require('./JobRequest');
const Rating = require('./Rating');
const Notification = require('./Notification');
const ChatMessage = require('./ChatMessage');
const Location = require('./Location');

// Associations
JobProvider.hasMany(JobRequest, { foreignKey: 'provider_id' });
JobRequest.belongsTo(JobProvider, { foreignKey: 'provider_id' });

Worker.hasMany(JobRequest, { foreignKey: 'worker_id' });
JobRequest.belongsTo(Worker, { foreignKey: 'worker_id' });

JobRequest.hasMany(ChatMessage, { foreignKey: 'job_request_id' });
ChatMessage.belongsTo(JobRequest, { foreignKey: 'job_request_id' });

JobRequest.hasMany(Rating, { foreignKey: 'job_request_id' });
Rating.belongsTo(JobRequest, { foreignKey: 'job_request_id' });

JobRequest.hasMany(Notification, { foreignKey: 'job_request_id' });
Notification.belongsTo(JobRequest, { foreignKey: 'job_request_id' });

module.exports = {
  sequelize,
  Admin,
  JobProvider,
  Worker,
  JobRequest,
  Rating,
  Notification,
  ChatMessage,
  Location
};
