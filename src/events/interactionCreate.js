const { PermissionsBitField, MessageFlags } = require('discord.js');
const { renderPanel } = require('../utils/ui');
const { isOwner } = require('../utils/permissions');
const { getGuildConfig } = require('../database/guildConfig');
const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      const owner = isOwner(interaction.user.id, client);
      if (client.runtime.maintenance && !owner && !command.maintenanceAllowed) {
        return reply(interaction, client, 'Maintenance', 'The bot is temporarily in maintenance mode. Please try again later.');
      }
      if (command.ownerOnly && !owner) return reply(interaction, client, 'Access denied', 'This command is restricted to configured bot owners.');
      if (interaction.guildId && await isDisabled(interaction.guildId, command.name)) {
        return reply(interaction, client, 'Command unavailable', 'This command is disabled in this server.');
      }
      if (command.permissions && interaction.inGuild()) {
        const required = new PermissionsBitField(command.permissions);
        if (!interaction.memberPermissions?.has(required)) return reply(interaction, client, 'Missing permission', `You need **${required.toArray().join(', ')}** to use this command.`);
      }
      const cooldown = checkCooldown(interaction.user.id, command, client);
      if (cooldown) return reply(interaction, client, 'Slow down', `Try again in ${cooldown} second(s).`);
      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Slash command ${interaction.commandName} failed`, error);
      if (interaction.deferred || interaction.replied) await interaction.followUp({ components: [renderPanel(client, 'Something went wrong', 'The command failed. Please try again later.')], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral }).catch(() => {});
      else await reply(interaction, client, 'Something went wrong', 'The command failed. Please try again later.');
    }
  }
};

function reply(interaction, client, title, description) {
  return interaction.reply({ components: [renderPanel(client, title, description)], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
}
async function isDisabled(guildId, commandName) {
  const config = await getGuildConfig(guildId);
  return config?.disabledCommands?.includes(commandName) || false;
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
