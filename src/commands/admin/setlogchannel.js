const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');
const GuildConfig = require('../../database/models/GuildConfig');
const { renderPanel, v2Reply } = require('../../utils/ui');

async function save(guildId, channelId) {
  if (mongoose.connection.readyState !== 1) throw new Error('MongoDB must be configured to save this setting.');
  await GuildConfig.findOneAndUpdate({ guildId }, { $set: { logChannelId: channelId } }, { upsert: true, new: true, runValidators: true });
}
module.exports = {
  name: 'setlogchannel', aliases: ['modlogs'], cooldown: 5, permissions: [PermissionFlagsBits.ManageGuild],
  data: new SlashCommandBuilder().setName('setlogchannel').setDescription('Set the channel for moderation case logs.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('channel').setDescription('Private staff log channel').setRequired(true).addChannelTypes(ChannelType.GuildText)),
  async execute(i, client) {
    try {
      const channel = i.options.getChannel('channel');
      if (!channel.permissionsFor(client.user).has(PermissionFlagsBits.SendMessages)) throw new Error('I need permission to send messages in that channel.');
      await save(i.guildId, channel.id);
      return v2Reply(i, client, 'Moderation logs configured', `Moderation case logs will be sent to ${channel}. Ensure the channel is private to trusted staff.`);
    } catch (e) { return v2Reply(i, client, 'Could not configure logs', e.message); }
  },
  async executePrefix(m, args, client) {
    const channel = m.mentions.channels.first();
    if (!channel || channel.type !== ChannelType.GuildText) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}setlogchannel #channel\``)], flags: MessageFlags.IsComponentsV2 });
    try { await save(m.guild.id, channel.id); return m.reply({ components: [renderPanel(client, 'Moderation logs configured', `Case logs will be sent to ${channel}. Ensure it is private to trusted staff.`)], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Could not configure logs', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
