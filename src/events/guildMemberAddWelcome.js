const { Events, MessageFlags } = require('discord.js');
const GuildConfig = require('../database/models/GuildConfig');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const config = await GuildConfig.findOne({ guildId: member.guild.id }).lean();
    if (!config?.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(config.welcomeChannelId) || await member.guild.channels.fetch(config.welcomeChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return;
    const text = (config.welcomeMessage || 'Welcome {user} to {guild}!').replace('{user}', `<@${member.id}>`).replace('{guild}', member.guild.name);
    await channel.send({ components: [renderPanel(client, 'Welcome', text)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
