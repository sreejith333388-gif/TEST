const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const GuildConfig = require('../../database/models/GuildConfig');

module.exports = {
  name: 'userinfo',
  aliases: ['memberinfo'],
  cooldown: 5,
  data: new SlashCommandBuilder().setName('userinfo').setDescription('Display basic information about a user.')
    .addUserOption((o) => o.setName('user').setDescription('User to inspect').setRequired(false)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(target.id) || await interaction.guild.members.fetch(target.id).catch(() => null);
    const joined = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Unavailable';
    const content = `**User:** ${target.tag}\n**ID:** ${target.id}\n**Joined:** ${joined}\n**Created:** <t:${Math.floor(target.createdTimestamp / 1000)}:F>`;
    return v2Reply(interaction, client, 'User information', content);
  },
  async executePrefix(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(target.id) || await message.guild.members.fetch(target.id).catch(() => null);
    const joined = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Unavailable';
    const content = `**User:** ${target.tag}\n**ID:** ${target.id}\n**Joined:** ${joined}\n**Created:** <t:${Math.floor(target.createdTimestamp / 1000)}:F>`;
    return message.reply({ components: [renderPanel(client, 'User information', content)], flags: MessageFlags.IsComponentsV2 });
  }
};
