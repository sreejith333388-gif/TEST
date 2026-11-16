const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.GuildBanRemove,
  async execute(ban, client) {
    const config = await getGuildConfig(ban.guild.id);
    if (!config?.logChannelId) return;
    const channel = ban.guild.channels.cache.get(config.logChannelId) || await ban.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Unban event', `**User:** ${ban.user.tag} (${ban.user.id})`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
