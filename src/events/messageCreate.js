const { Events, MessageFlags } = require('discord.js');
const { renderPanel } = require('../utils/ui');
const { isOwner } = require('../utils/permissions');
const { getGuildConfig } = require('../database/guildConfig');
const logger = require('../utils/logger');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;
    let prefix = client.config.prefix;
    try {
      const config = await getGuildConfig(message.guild.id);
      if (config?.prefix) prefix = config.prefix;
    } catch (error) {
      logger.error('Could not load guild prefix', error);
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const name = args.shift()?.toLowerCase();
    if (!name) return;
    const command = client.commands.get(name);
    if (!command || typeof command.executePrefix !== 'function') return;
    try {
      if (command.ownerOnly && !isOwner(message.author.id, client)) {
        return message.reply({ components: [renderPanel(client, 'Access denied', 'This command is restricted to configured bot owners.')], flags: MessageFlags.IsComponentsV2 });
      }
      const config = await getGuildConfig(message.guild.id);
      if (config?.disabledCommands?.includes(command.name)) {
        return message.reply({ components: [renderPanel(client, 'Command unavailable', 'This command is disabled in this server.')], flags: MessageFlags.IsComponentsV2 });
      }
      await command.executePrefix(message, args, client);
    } catch (error) {
      logger.error(`Prefix command ${name} failed`, error);
      await message.reply({ components: [renderPanel(client, 'Something went wrong', 'The command failed. Please try again later.')], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    }
  }
};
