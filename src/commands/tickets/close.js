const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Ticket = require('../../database/models/Ticket');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'closeticket',
  aliases: ['close'],
  cooldown: 5,
  permissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder().setName('closeticket').setDescription('Close an open support ticket.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((o) => o.setName('channel').setDescription('Ticket channel to close').setRequired(true)),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    await Ticket.updateOne({ guildId: interaction.guildId, channelId: channel.id }, { $set: { status: 'closed', closedBy: interaction.user.id } }, { upsert: true });
    await channel.send({ components: [renderPanel(client, 'Ticket closed', `This ticket was closed by **${interaction.user.tag}**.`)], flags: MessageFlags.IsComponentsV2 });
    return v2Reply(interaction, client, 'Ticket closed', `${channel} has been marked closed.`);
  },
  async executePrefix(message, args, client) {
    const channel = message.mentions.channels.first() || message.channel;
    await Ticket.updateOne({ guildId: message.guild.id, channelId: channel.id }, { $set: { status: 'closed', closedBy: message.author.id } }, { upsert: true });
    await channel.send({ components: [renderPanel(client, 'Ticket closed', `This ticket was closed by **${message.author.tag}**.`)], flags: MessageFlags.IsComponentsV2 });
    return message.reply({ components: [renderPanel(client, 'Ticket closed', `${channel} has been marked closed.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
