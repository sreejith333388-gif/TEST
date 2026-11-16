const { SlashCommandBuilder } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'ping',
  aliases: ['latency'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('ping').setDescription('Show bot and API latency.'),
  async execute(interaction, client) {
    const roundTrip = Date.now() - interaction.createdTimestamp;
    return v2Reply(interaction, client, 'Pong!', `Gateway: **${Math.round(client.ws.ping)} ms**\nRound trip: **${roundTrip} ms**`);
  },
  async executePrefix(message, args, client) {
    const roundTrip = Date.now() - message.createdTimestamp;
    return message.reply({ components: [renderPanel(client, 'Pong!', `Gateway: **${Math.round(client.ws.ping)} ms**\nRound trip: **${roundTrip} ms**`)], flags: require('discord.js').MessageFlags.IsComponentsV2 });
  }
};
