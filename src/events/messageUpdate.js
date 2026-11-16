const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage, client) {
    if (!newMessage.guild || newMessage.author?.bot || oldMessage.content === newMessage.content) return;
    const config = await getGuildConfig(newMessage.guild.id);
    if (!config?.logChannelId) return;
    const channel = newMessage.guild.channels.cache.get(config.logChannelId) || await newMessage.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (!channel?.isTextBased()) return;
    await channel.send({ components: [renderPanel(client, 'Message edited', `**Author:** ${newMessage.author?.tag || 'Unknown'}\n**Channel:** <#${newMessage.channelId}>\n[Jump to message](${newMessage.url})\nContent is not copied into logs.`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
