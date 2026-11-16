const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    const config = await getGuildConfig(member.guild.id);
    if (!config?.logChannelId) return;
    const channel = member.guild.channels.cache.get(config.logChannelId) || await member.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Member left', `**Member:** ${member.user?.tag || 'Unknown'} (${member.id})`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
