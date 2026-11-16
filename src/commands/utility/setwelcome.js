const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const GuildConfig = require('../../database/models/GuildConfig');

module.exports = {
  name: 'setwelcome',
  aliases: ['welcomeconfig'],
  cooldown: 3,
  permissions: ['ManageGuild'],
  data: new SlashCommandBuilder().setName('setwelcome').setDescription('Configure the welcome message for this server.')
    .addChannelOption((o) => o.setName('channel').setDescription('Channel for welcome messages').setRequired(true))
    .addStringOption((o) => o.setName('message').setDescription('Welcome message text').setRequired(false).setMaxLength(500)),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message') || 'Welcome {user} to {guild}!';
    await GuildConfig.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { welcomeChannelId: channel.id, welcomeMessage: message } }, { upsert: true, new: true });
    return v2Reply(interaction, client, 'Welcome configured', `Welcome messages will be sent to ${channel} using: **${message}**`);
  },
  async executePrefix(message, args, client) {
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}setwelcome #channel [message]\``)], flags: MessageFlags.IsComponentsV2 });
    const msgText = args.slice(1).join(' ') || 'Welcome {user} to {guild}!';
    await GuildConfig.findOneAndUpdate({ guildId: message.guild.id }, { $set: { welcomeChannelId: channel.id, welcomeMessage: msgText } }, { upsert: true, new: true });
    return message.reply({ components: [renderPanel(client, 'Welcome configured', `Welcome messages will be sent to ${channel} using: **${msgText}**`)], flags: MessageFlags.IsComponentsV2 });
  }
};
