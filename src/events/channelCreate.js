const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.ChannelCreate,
  async execute(created, client) {
    if (!created.guild) return;
    const config = await getGuildConfig(created.guild.id);
    if (!config?.logChannelId) return;
    const channel = created.guild.channels.cache.get(config.logChannelId) || await created.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Channel created', `**Channel:** ${created.name} (${created.id})`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
