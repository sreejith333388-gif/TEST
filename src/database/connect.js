const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDatabase(uri) {
  if (!uri) {
    logger.info('MONGODB_URI is empty; database features are disabled.');
    return false;
  }
  mongoose.connection.on('error', (error) => logger.error('MongoDB connection error', error));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected.'));
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 10 });
  logger.info('MongoDB connected.');
  return true;
}

module.exports = { connectDatabase };
