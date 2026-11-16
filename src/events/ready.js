const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const status = process.env.STATUS || 'online';
    client.user.setPresence({ status, activities: [{ name: process.env.BOT_NAME || 'Aishu' }] });
    logger.info(`Logged in as ${client.user.tag}; ready in ${client.guilds.cache.size} guild(s).`);
  }
};
