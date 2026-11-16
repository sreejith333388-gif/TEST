const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.GuildRoleCreate,
  async execute(role, client) {
    const config = await getGuildConfig(role.guild.id);
    if (!config?.logChannelId) return;
    const channel = role.guild.channels.cache.get(config.logChannelId) || await role.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Role created', `**Role:** ${role.name} (${role.id})`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
