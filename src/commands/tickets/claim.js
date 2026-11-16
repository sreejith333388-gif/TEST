const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Ticket = require('../../database/models/Ticket');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'claimticket',
  aliases: ['claim'],
  cooldown: 5,
  permissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder().setName('claimticket').setDescription('Claim an open support ticket.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((o) => o.setName('channel').setDescription('Ticket channel to claim').setRequired(true)),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    await Ticket.updateOne({ guildId: interaction.guildId, channelId: channel.id }, { $set: { status: 'claimed', assigneeId: interaction.user.id } }, { upsert: true });
    return v2Reply(interaction, client, 'Ticket claimed', `You claimed ${channel}.`);
  },
  async executePrefix(message, args, client) {
    const channel = message.mentions.channels.first() || message.channel;
    await Ticket.updateOne({ guildId: message.guild.id, channelId: channel.id }, { $set: { status: 'claimed', assigneeId: message.author.id } }, { upsert: true });
    return message.reply({ components: [renderPanel(client, 'Ticket claimed', `You claimed ${channel}.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
