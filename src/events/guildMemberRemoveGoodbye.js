const { Events, MessageFlags } = require('discord.js');
const GuildConfig = require('../database/models/GuildConfig');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    const config = await GuildConfig.findOne({ guildId: member.guild.id }).lean();
    if (!config?.goodbyeChannelId) return;
    const channel = member.guild.channels.cache.get(config.goodbyeChannelId) || await member.guild.channels.fetch(config.goodbyeChannelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return;
    const text = (config.goodbyeMessage || 'Goodbye {user}.').replace('{user}', `${member.user.tag}`);
    await channel.send({ components: [renderPanel(client, 'Goodbye', text)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
  }
};
