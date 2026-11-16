const mongoose = require('mongoose');
const GuildConfig = require('./models/GuildConfig');

async function getGuildConfig(guildId) {
  if (mongoose.connection.readyState !== 1) return null;
  return GuildConfig.findOne({ guildId }).lean();
}

module.exports = { getGuildConfig };
