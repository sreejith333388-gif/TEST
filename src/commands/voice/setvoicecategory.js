const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const VoiceConfig = require('../../database/models/VoiceConfig');

module.exports = {
  name: 'setvoicecategory',
  aliases: ['voicecategory'],
  cooldown: 5,
  permissions: [PermissionFlagsBits.ManageChannels],
  data: new SlashCommandBuilder().setName('setvoicecategory').setDescription('Set the category used for temporary private voice channels.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((o) => o.setName('category').setDescription('Category channel').setRequired(true)),
  async execute(interaction, client) {
    const category = interaction.options.getChannel('category');
    await VoiceConfig.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { categoryId: category.id } }, { upsert: true, new: true });
    return v2Reply(interaction, client, 'Voice category configured', `Private voice channels will be created under ${category}.`);
  },
  async executePrefix(message, args, client) {
    const category = message.mentions.channels.first();
    if (!category) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}setvoicecategory #category\``)], flags: MessageFlags.IsComponentsV2 });
    await VoiceConfig.findOneAndUpdate({ guildId: message.guild.id }, { $set: { categoryId: category.id } }, { upsert: true, new: true });
    return message.reply({ components: [renderPanel(client, 'Voice category configured', `Private voice channels will be created under ${category}.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
