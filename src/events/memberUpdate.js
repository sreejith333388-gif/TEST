const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember, client) {
    if (oldMember.nickname === newMember.nickname) return;
    const config = await getGuildConfig(newMember.guild.id);
    if (!config?.logChannelId) return;
    const channel = newMember.guild.channels.cache.get(config.logChannelId) || await newMember.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, 'Nickname updated', `**Member:** ${newMember.user.tag}\n**Before:** ${oldMember.nickname || 'None'}\n**After:** ${newMember.nickname || 'None'}`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
