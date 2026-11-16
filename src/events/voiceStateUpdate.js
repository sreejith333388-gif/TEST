const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');
module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client) {
    const member = newState.member || oldState.member;
    if (!member || oldState.channelId === newState.channelId) return;
    const config = await getGuildConfig(member.guild.id);
    if (!config?.logChannelId) return;
    const channel = member.guild.channels.cache.get(config.logChannelId) || await member.guild.channels.fetch(config.logChannelId).catch(() => null);
    if (!channel?.isTextBased()) return;
    const from = oldState.channel ? `<#${oldState.channelId}>` : 'not connected';
    const to = newState.channel ? `<#${newState.channelId}>` : 'disconnected';
    await channel.send({ components: [renderPanel(client, 'Voice channel update', `**Member:** ${member.user.tag}\n**From:** ${from}\n**To:** ${to}`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
