const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getLevelUser, getLevelFromXp, awardXp } = require('../../database/economy');
const LevelUser = require('../../database/models/LevelUser');
const { renderPanel } = require('../../utils/ui');

module.exports = {
  name: 'xp',
  aliases: ['experience'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('xp').setDescription('Check XP and level progression for a member.'),
  async execute(interaction, client) {
    const record = await LevelUser.findOne({ guildId: interaction.guildId, userId: interaction.user.id }).lean();
    const level = record?.level || 1;
    const xp = record?.xp || 0;
    const nextLevelXp = (level * level) * 50;
    return interaction.reply({ components: [renderPanel(client, `${interaction.user.tag}'s XP`, `**Level:** ${level}\n**Current XP:** ${xp}\n**Next level at:** ${nextLevelXp}`)], flags: MessageFlags.IsComponentsV2 });
  },
  async executePrefix(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const record = await LevelUser.findOne({ guildId: message.guild.id, userId: target.id }).lean();
    const level = record?.level || 1;
    const xp = record?.xp || 0;
    const nextLevelXp = (level * level) * 50;
    return message.reply({ components: [renderPanel(client, `${target.tag}'s XP`, `**Level:** ${level}\n**Current XP:** ${xp}\n**Next level at:** ${nextLevelXp}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
