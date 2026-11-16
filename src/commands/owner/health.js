const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const os = require('node:os');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'health',
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder().setName('health').setDescription('Show read-only process and database health (bot owner only).'),
  async execute(interaction, client) {
    if (!isOwner(interaction.user.id, client)) return v2Reply(interaction, client, 'Access denied', 'This command is restricted to configured bot owners.');
    const mongoose = require('mongoose');
    const db = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
    const description = `**Process:** healthy\n**Database:** ${db}\n**Uptime:** ${Math.floor(process.uptime())} seconds\n**Memory RSS:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB\n**Host platform:** ${os.platform()}`;
    return v2Reply(interaction, client, 'Runtime health', description);
  },
  async executePrefix(message, args, client) {
    if (!isOwner(message.author.id, client)) return message.reply({ components: [renderPanel(client, 'Access denied', 'This command is restricted to configured bot owners.')], flags: MessageFlags.IsComponentsV2 });
    const mongoose = require('mongoose');
    const db = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
    return message.reply({ components: [renderPanel(client, 'Runtime health', `**Process:** healthy\n**Database:** ${db}\n**Uptime:** ${Math.floor(process.uptime())} seconds\n**Memory RSS:** ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB\n**Host platform:** ${os.platform()}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
