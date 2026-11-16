const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const GuildConfig = require('../../database/models/GuildConfig');

module.exports = {
  name: 'setgoodbye',
  aliases: ['goodbyeconfig'],
  cooldown: 3,
  permissions: ['ManageGuild'],
  data: new SlashCommandBuilder().setName('setgoodbye').setDescription('Configure the goodbye message for this server.')
    .addChannelOption((o) => o.setName('channel').setDescription('Channel for goodbye messages').setRequired(true))
    .addStringOption((o) => o.setName('message').setDescription('Goodbye message text').setRequired(false).setMaxLength(500)),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message') || 'Goodbye {user}. See you again soon!';
    await GuildConfig.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { goodbyeChannelId: channel.id, goodbyeMessage: message } }, { upsert: true, new: true });
    return v2Reply(interaction, client, 'Goodbye configured', `Goodbye messages will be sent to ${channel} using: **${message}**`);
  },
  async executePrefix(message, args, client) {
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}setgoodbye #channel [message]\``)], flags: MessageFlags.IsComponentsV2 });
    const msgText = args.slice(1).join(' ') || 'Goodbye {user}. See you again soon!';
    await GuildConfig.findOneAndUpdate({ guildId: message.guild.id }, { $set: { goodbyeChannelId: channel.id, goodbyeMessage: msgText } }, { upsert: true, new: true });
    return message.reply({ components: [renderPanel(client, 'Goodbye configured', `Goodbye messages will be sent to ${channel} using: **${msgText}**`)], flags: MessageFlags.IsComponentsV2 });
  }
};
