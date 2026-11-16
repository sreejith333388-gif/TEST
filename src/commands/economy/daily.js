const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getEconomyUser, addCoins } = require('../../database/economy');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'daily',
  aliases: ['claim'],
  cooldown: 5,
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily reward.'),
  async execute(interaction, client) {
    const record = await getEconomyUser(interaction.guildId, interaction.user.id);
    const now = Date.now();
    if (record.lastDaily && now - new Date(record.lastDaily).getTime() < 86400000) {
      const remaining = 86400000 - (now - new Date(record.lastDaily).getTime());
      return v2Reply(interaction, client, 'Daily already claimed', `You can claim again in ${Math.ceil(remaining / 60000)} minute(s).`);
    }
    const reward = 250;
    await addCoins(interaction.guildId, interaction.user.id, reward);
    await require('../../database/models/EconomyUser').updateOne({ guildId: interaction.guildId, userId: interaction.user.id }, { $set: { lastDaily: new Date() } }, { upsert: true });
    return v2Reply(interaction, client, 'Daily reward claimed', `You received **${reward} coins**. Your wallet is now updated.`);
  },
  async executePrefix(message, args, client) {
    const record = await getEconomyUser(message.guild.id, message.author.id);
    const now = Date.now();
    if (record.lastDaily && now - new Date(record.lastDaily).getTime() < 86400000) {
      const remaining = 86400000 - (now - new Date(record.lastDaily).getTime());
      return message.reply({ components: [renderPanel(client, 'Daily already claimed', `You can claim again in ${Math.ceil(remaining / 60000)} minute(s).`)], flags: MessageFlags.IsComponentsV2 });
    }
    const reward = 250;
    await addCoins(message.guild.id, message.author.id, reward);
    await require('../../database/models/EconomyUser').updateOne({ guildId: message.guild.id, userId: message.author.id }, { $set: { lastDaily: new Date() } }, { upsert: true });
    return message.reply({ components: [renderPanel(client, 'Daily reward claimed', `You received **${reward} coins**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
