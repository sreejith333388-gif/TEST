const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'lock', aliases: ['channel-lock'], cooldown: 3,
  permissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder().setName('lock').setDescription('Lock a channel to prevent message sending.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    const channel = interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    return v2Reply(interaction, client, 'Channel locked', `**${channel.name}** is now locked.`);
  },
  async executePrefix(message, args, client) {
    const channel = message.channel;
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
    return message.reply({ components: [renderPanel(client, 'Channel locked', `**${channel.name}** is now locked.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
