const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const os = require('node:os');
const mongoose = require('mongoose');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');

function content(client) {
  return `**Name:** ${client.config.name}\n**Guilds:** ${client.guilds.cache.size}\n**Cached users:** ${client.users.cache.size}\n**Loaded commands:** ${new Set(client.commands.values()).size}\n**Uptime:** ${Math.floor(process.uptime())} seconds\n**Memory RSS:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB\n**Platform:** ${os.platform()}\n**MongoDB:** ${['disconnected','connected','connecting','disconnecting'][mongoose.connection.readyState] || 'unknown'}\n**Maintenance:** ${client.runtime.maintenance ? 'on' : 'off'}`;
}
module.exports = {
  name: 'botstats', aliases: ['ownerstats'], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('botstats').setDescription('Show bot runtime statistics (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Bot statistics', content(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Bot statistics', content(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
