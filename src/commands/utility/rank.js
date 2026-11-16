const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const LevelUser = require('../../database/models/LevelUser');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'rank',
  aliases: ['level'],
  cooldown: 5,
  data: new SlashCommandBuilder().setName('rank').setDescription('Check your current XP and level.')
    .addUserOption((o) => o.setName('user').setDescription('User to inspect').setRequired(false)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const record = await LevelUser.findOne({ guildId: interaction.guildId, userId: target.id }).lean();
    const level = record?.level || 1;
    const xp = record?.xp || 0;
    return v2Reply(interaction, client, `${target.tag}'s rank`, `**Level:** ${level}\n**XP:** ${xp}`);
  },
  async executePrefix(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const record = await LevelUser.findOne({ guildId: message.guild.id, userId: target.id }).lean();
    const level = record?.level || 1;
    const xp = record?.xp || 0;
    return message.reply({ components: [renderPanel(client, `${target.tag}'s rank`, `**Level:** ${level}\n**XP:** ${xp}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
