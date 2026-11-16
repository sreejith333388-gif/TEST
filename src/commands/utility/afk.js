const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const AfkUser = require('../../database/models/AfkUser');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'afk',
  aliases: ['away'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('afk').setDescription('Set your AFK status for this server.')
    .addStringOption((o) => o.setName('reason').setDescription('AFK reason').setRequired(false).setMaxLength(200)),
  async execute(interaction, client) {
    const reason = interaction.options.getString('reason') || 'AFK';
    await AfkUser.findOneAndUpdate({ guildId: interaction.guildId, userId: interaction.user.id }, { $set: { reason } }, { upsert: true, new: true });
    return v2Reply(interaction, client, 'AFK set', `You are now marked as AFK. Reason: **${reason}**`);
  },
  async executePrefix(message, args, client) {
    const reason = args.join(' ') || 'AFK';
    await AfkUser.findOneAndUpdate({ guildId: message.guild.id, userId: message.author.id }, { $set: { reason } }, { upsert: true, new: true });
    return message.reply({ components: [renderPanel(client, 'AFK set', `You are now marked as AFK. Reason: **${reason}**`)], flags: MessageFlags.IsComponentsV2 });
  }
};
