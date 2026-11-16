const { ChannelType, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Ticket = require('../../database/models/Ticket');
const { renderPanel, v2Reply } = require('../../utils/ui');

async function createTicket(guild, creator, reason, category) {
  const categoryName = 'Tickets';
  let parent = guild.channels.cache.find((ch) => ch.type === ChannelType.GuildCategory && ch.name.toLowerCase() === categoryName.toLowerCase());
  if (!parent) {
    parent = await guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory, reason: 'Create ticket category' });
  }
  const channel = await guild.channels.create({
    name: `ticket-${creator.username.toLowerCase()}`,
    type: ChannelType.GuildText,
    parent,
    permissionOverwrites: [
      { id: guild.roles.everyone, deny: ['ViewChannel'] },
      { id: creator.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }
    ],
    reason: reason || 'New support ticket'
  });
  await Ticket.create({ guildId: guild.id, creatorId: creator.id, channelId: channel.id, category: category || 'general', reason: reason || 'No reason provided' });
  return channel;
}

module.exports = {
  name: 'newticket',
  aliases: ['ticket'],
  cooldown: 10,
  data: new SlashCommandBuilder().setName('newticket').setDescription('Open a support ticket in this server.')
    .addStringOption((o) => o.setName('reason').setDescription('Ticket reason').setRequired(false).setMaxLength(200)),
  async execute(interaction, client) {
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const channel = await createTicket(interaction.guild, interaction.user, reason, 'general');
    await channel.send({ components: [renderPanel(client, 'Ticket opened', `**User:** ${interaction.user.tag}\n**Reason:** ${reason}\n**Staff:** a moderator will be with you soon.`)], flags: MessageFlags.IsComponentsV2 });
    return v2Reply(interaction, client, 'Ticket created', `Your ticket was created: ${channel}`);
  },
  async executePrefix(message, args, client) {
    const reason = args.join(' ') || 'No reason provided';
    const channel = await createTicket(message.guild, message.author, reason, 'general');
    await channel.send({ components: [renderPanel(client, 'Ticket opened', `**User:** ${message.author.tag}\n**Reason:** ${reason}\n**Staff:** a moderator will be with you soon.`)], flags: MessageFlags.IsComponentsV2 });
    return message.reply({ components: [renderPanel(client, 'Ticket created', `Your ticket was created: ${channel}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
