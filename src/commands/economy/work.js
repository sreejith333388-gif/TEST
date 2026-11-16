const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getEconomyUser, addCoins } = require('../../database/economy');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'work',
  aliases: ['job'],
  cooldown: 60,
  data: new SlashCommandBuilder().setName('work').setDescription('Work a job to earn coins.'),
  async execute(interaction, client) {
    const jobs = ['Cleaner', 'Delivery driver', 'Streamer', 'Builder', 'Moderator', 'Designer'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const reward = Math.floor(Math.random() * 200) + 80;
    await addCoins(interaction.guildId, interaction.user.id, reward);
    return v2Reply(interaction, client, 'Work complete', `You worked as a **${job}** and earned **${reward} coins**.`);
  },
  async executePrefix(message, args, client) {
    const jobs = ['Cleaner', 'Delivery driver', 'Streamer', 'Builder', 'Moderator', 'Designer'];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const reward = Math.floor(Math.random() * 200) + 80;
    await addCoins(message.guild.id, message.author.id, reward);
    return message.reply({ components: [renderPanel(client, 'Work complete', `You worked as a **${job}** and earned **${reward} coins**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
