const { Events, MessageFlags } = require('discord.js');
const { renderPanel } = require('../utils/ui');
const { isOwner } = require('../utils/permissions');
const { getGuildConfig } = require('../database/guildConfig');
const logger = require('../utils/logger');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      if (command.ownerOnly && !isOwner(interaction.user.id, client)) {
        return interaction.reply({ components: [renderPanel(client, 'Access denied', 'This command is restricted to configured bot owners.')], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      if (interaction.guildId && await isDisabled(interaction.guildId, command.name)) {
        return interaction.reply({ components: [renderPanel(client, 'Command unavailable', 'This command is disabled in this server.')], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      }
      const cooldown = checkCooldown(interaction.user.id, command, client);
      if (cooldown) return interaction.reply({ components: [renderPanel(client, 'Slow down', `Try again in ${cooldown} second(s).`)], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Slash command ${interaction.commandName} failed`, error);
      const payload = { components: [renderPanel(client, 'Something went wrong', 'The command failed. Please try again later.')], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral };
      if (interaction.deferred || interaction.replied) await interaction.followUp(payload).catch(() => {});
      else await interaction.reply(payload).catch(() => {});
    }
  }
};

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
  setTimeout(() => client.cooldowns.delete(key), seconds * 1000).unref?.();
  return 0;
}
