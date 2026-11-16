const { Events, MessageFlags } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('../utils/ui');

async function log(member, client, title, body) {
  const config = await getGuildConfig(member.guild.id);
  if (!config?.logChannelId) return;
  const channel = member.guild.channels.cache.get(config.logChannelId) || await member.guild.channels.fetch(config.logChannelId).catch(() => null);
  if (channel?.isTextBased()) await channel.send({ components: [renderPanel(client, title, body)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
}
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    await log(member, client, 'Member joined', `**Member:** ${member.user.tag} (${member.id})\n**Account created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`);
  }
};
