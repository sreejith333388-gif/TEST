const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

const command = {
  name: 'help',
  aliases: ['commands'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('help').setDescription('Show available starter commands.'),
  async execute(interaction, client) {
    return v2Reply(interaction, client, 'Command guide', `**General**\n` +
      `• \`/${client.commands.get('ping').name}\` — latency check\n` +
      `• \`/help\` — this guide\n` +
      `• \`/botinfo\` — bot details\n\n` +
      `**Owner**\n• \`/health\` — read-only runtime health (configured owners only)\n\n` +
      `Prefix commands use \`${client.config.prefix}\`. Configure OWNER_IDS in your private .env file.`);
  },
  async executePrefix(message, args, client) {
    return message.reply({ components: [renderPanel(client, 'Command guide', `Try \`${client.config.prefix}ping\`, \`${client.config.prefix}botinfo\`, or \`${client.config.prefix}help\`. Owner-only health check: \`${client.config.prefix}health\`.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
module.exports = command;
