const { Events, PermissionsBitField, MessageFlags } = require('discord.js');
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
      if (command.ownerOnly && !isOwner(message.author.id, client)) return send(message, client, 'Access denied', 'This command is restricted to configured bot owners.');
      const config = await getGuildConfig(message.guild.id);
      if (config?.disabledCommands?.includes(command.name)) return send(message, client, 'Command unavailable', 'This command is disabled in this server.');
      if (command.permissions && !message.member.permissions.has(new PermissionsBitField(command.permissions))) {
        return send(message, client, 'Missing permission', `You need **${new PermissionsBitField(command.permissions).toArray().join(', ')}** to use this command.`);
      }
      const cooldown = checkCooldown(message.author.id, command, client);
      if (cooldown) return send(message, client, 'Slow down', `Try again in ${cooldown} second(s).`);
      await command.executePrefix(message, args, client);
    } catch (error) {
      logger.error(`Prefix command ${name} failed`, error);
      await send(message, client, 'Something went wrong', 'The command failed. Please try again later.').catch(() => {});
    }
  }
};

function send(message, client, title, description) {
  return message.reply({ components: [renderPanel(client, title, description)], flags: MessageFlags.IsComponentsV2 });
}

function checkCooldown(userId, command, client) {
  const seconds = Number(command.cooldown || 0);
  if (!seconds) return 0;
  const key = `${command.name}:${userId}`;
  const expiry = client.cooldowns.get(key);
  const now = Date.now();
  if (expiry && expiry > now) return Math.ceil((expiry - now) / 1000);
  client.cooldowns.set(key, now + seconds * 1000);
  const timer = setTimeout(() => client.cooldowns.delete(key), seconds * 1000);
  timer.unref?.();
  return 0;
}
