const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'serverinfo',
  aliases: ['guildinfo'],
  cooldown: 5,
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Display information about the current server.'),
  async execute(interaction, client) {
    const guild = interaction.guild;
    const content = `**Server:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** <@${guild.ownerId}>\n**Members:** ${guild.memberCount}\n**Channels:** ${guild.channels.cache.size}\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;
    return v2Reply(interaction, client, 'Server information', content);
  },
  async executePrefix(message, args, client) {
    const guild = message.guild;
    const content = `**Server:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** <@${guild.ownerId}>\n**Members:** ${guild.memberCount}\n**Channels:** ${guild.channels.cache.size}\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;
    return message.reply({ components: [renderPanel(client, 'Server information', content)], flags: MessageFlags.IsComponentsV2 });
  }
};
