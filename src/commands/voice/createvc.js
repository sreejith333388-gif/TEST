const { ChannelType, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const VoiceConfig = require('../../database/models/VoiceConfig');

module.exports = {
  name: 'createvc',
  aliases: ['vc', 'voicecreate'],
  cooldown: 10,
  permissions: [PermissionFlagsBits.Connect],
  data: new SlashCommandBuilder().setName('createvc').setDescription('Create a temporary private voice channel.')
    .addStringOption((o) => o.setName('name').setDescription('Voice channel name').setRequired(false).setMaxLength(32)),
  async execute(interaction, client) {
    const config = await VoiceConfig.findOne({ guildId: interaction.guildId }).lean();
    const category = config?.categoryId ? interaction.guild.channels.cache.get(config.categoryId) : null;
    const channel = await interaction.guild.channels.create({
      name: interaction.options.getString('name') || `${interaction.user.username}'s room`,
      type: ChannelType.GuildVoice,
      parent: category?.id || null,
      userLimit: config?.maxUsers || 0,
      reason: 'Private voice room created by user'
    });
    await interaction.member.voice.setChannel(channel).catch(() => {});
    return v2Reply(interaction, client, 'Voice room ready', `Your private room is ready: ${channel}`);
  },
  async executePrefix(message, args, client) {
    const config = await VoiceConfig.findOne({ guildId: message.guild.id }).lean();
    const category = config?.categoryId ? message.guild.channels.cache.get(config.categoryId) : null;
    const channel = await message.guild.channels.create({
      name: args.join(' ') || `${message.author.username}'s room`,
      type: ChannelType.GuildVoice,
      parent: category?.id || null,
      userLimit: config?.maxUsers || 0,
      reason: 'Private voice room created by user'
    });
    await message.member.voice.setChannel(channel).catch(() => {});
    return message.reply({ components: [renderPanel(client, 'Voice room ready', `Your private room is ready: ${channel}`)], flags: MessageFlags.IsComponentsV2 });
  }
};
