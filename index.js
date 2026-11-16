require('dotenv').config();
const { createClient } = require('./src/client');
const { connectDatabase } = require('./src/database/connect');
const logger = require('./src/utils/logger');

async function main() {
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error('BOT_TOKEN is required. Copy .env.example to .env and configure it.');

  await connectDatabase(process.env.MONGODB_URI);
  const client = createClient();
  await client.login(token);

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}; shutting down gracefully.`);
    client.destroy();
    process.exit(0);
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

process.on('unhandledRejection', (error) => logger.error('Unhandled promise rejection', error));
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exitCode = 1;
});

main().catch((error) => {
  logger.error('Startup failed', error);
  process.exit(1);
});
