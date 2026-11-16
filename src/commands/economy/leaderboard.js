const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const EconomyUser = require('../../database/models/EconomyUser');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'leaderboard',
  aliases: ['lb'],
  cooldown: 10,
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Show the top economy users in this server.'),
  async execute(interaction, client) {
    const rows = await EconomyUser.find({ guildId: interaction.guildId }).sort({ wallet: -1, bank: -1 }).limit(10).lean();
    const text = rows.length ? rows.map((r, index) => `#${index + 1}. <@${r.userId}> — ${r.wallet + r.bank} coins`).join('\n') : 'No economy activity yet.';
    return v2Reply(interaction, client, 'Economy leaderboard', text);
  },
  async executePrefix(message, args, client) {
    const rows = await EconomyUser.find({ guildId: message.guild.id }).sort({ wallet: -1, bank: -1 }).limit(10).lean();
    const text = rows.length ? rows.map((r, index) => `#${index + 1}. <@${r.userId}> — ${r.wallet + r.bank} coins`).join('\n') : 'No economy activity yet.';
    return message.reply({ components: [renderPanel(client, 'Economy leaderboard', text)], flags: MessageFlags.IsComponentsV2 });
  }
};
