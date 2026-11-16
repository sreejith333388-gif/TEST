const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');

async function log(guild, client, title, body) {
  const config = await getGuildConfig(guild.id);
  if (!config?.logChannelId) return;
  const channel = guild.channels.cache.get(config.logChannelId) || await guild.channels.fetch(config.logChannelId).catch(() => null);
  if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, title, body)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
}

module.exports = {
  name: Events.MessageDelete,
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;
    await log(message.guild, client, 'Message deleted', `**Author:** ${message.author ? `${message.author.tag} (${message.author.id})` : 'Unknown/cached unavailable'}\n**Channel:** <#${message.channelId}>\nMessage content is intentionally not copied into logs.`);
  }
};
