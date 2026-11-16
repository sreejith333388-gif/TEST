const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'unlock', aliases: ['channel-unlock'], cooldown: 3,
  permissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder().setName('unlock').setDescription('Unlock a channel for regular chat.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const channel = interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    return v2Reply(interaction, client, 'Channel unlocked', `**${channel.name}** is now unlocked.`);
  },
  async executePrefix(message, args, client) {
    const channel = message.channel;
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
    return message.reply({ components: [renderPanel(client, 'Channel unlocked', `**${channel.name}** is now unlocked.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
