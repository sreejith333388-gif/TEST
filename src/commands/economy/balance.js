const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getEconomyUser } = require('../../database/economy');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'balance',
  aliases: ['bal'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('balance').setDescription('Check a user’s wallet and bank balance.')
    .addUserOption((o) => o.setName('user').setDescription('User to inspect').setRequired(false)),
  async execute(interaction, client) {
    const target = interaction.options.getUser('user') || interaction.user;
    const record = await getEconomyUser(interaction.guildId, target.id);
    return v2Reply(interaction, client, `${target.tag}'s balance`, `**Wallet:** ${record.wallet || 0}\n**Bank:** ${record.bank || 0}\n**Net:** ${(record.wallet || 0) + (record.bank || 0)}`);
  },
  async executePrefix(message, args, client) {
    const target = message.mentions.users.first() || message.author;
    const record = await getEconomyUser(message.guild.id, target.id);
    return message.reply({ components: [renderPanel(client, `${target.tag}'s balance`, `**Wallet:** ${record.wallet || 0}\n**Bank:** ${record.bank || 0}\n**Net:** ${(record.wallet || 0) + (record.bank || 0)}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
