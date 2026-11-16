const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'botinfo',
  aliases: ['about'],
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Show bot runtime information.'),
  async execute(interaction, client) {
    const text = `**Name:** ${client.config.name}\n**Servers:** ${client.guilds.cache.size}\n**Users (cached):** ${client.users.cache.size}\n**Uptime:** ${Math.floor(client.uptime / 1000)} seconds`;
    return v2Reply(interaction, client, 'Bot information', text);
  },
  async executePrefix(message, args, client) {
    const text = `**Name:** ${client.config.name}\n**Servers:** ${client.guilds.cache.size}\n**Uptime:** ${Math.floor(client.uptime / 1000)} seconds`;
    return message.reply({ components: [renderPanel(client, 'Bot information', text)], flags: MessageFlags.IsComponentsV2 });
  }
};
