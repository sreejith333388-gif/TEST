const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.GuildBanAdd,
  async execute(ban, client) {
    const config = await getGuildConfig(ban.guild.id);
    if (!config?.logChannelId) return;
    const channel = ban.guild.channels.cache.get(config.logChannelId) || await ban.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Ban event', `**User:** ${ban.user.tag} (${ban.user.id})\n**Reason:** ${ban.reason || 'Not provided'}`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
