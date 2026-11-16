const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const ReactionRole = require('../../database/models/ReactionRole');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'reactionrole', aliases: ['rr'], cooldown: 5,
  permissions: [PermissionFlagsBits.ManageRoles],
  data: new SlashCommandBuilder().setName('reactionrole').setDescription('Register a reaction role mapping for a message.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption((o) => o.setName('message_id').setDescription('Message ID').setRequired(true))
    .addStringOption((o) => o.setName('emoji').setDescription('Emoji').setRequired(true))
    .addRoleOption((o) => o.setName('role').setDescription('Role to grant').setRequired(true)),
  async execute(interaction, client) {
    const messageId = interaction.options.getString('message_id');
    const emoji = interaction.options.getString('emoji');
    const role = interaction.options.getRole('role');
    await ReactionRole.create({ guildId: interaction.guildId, messageId, emoji, roleId: role.id, channelId: interaction.channelId });
    return v2Reply(interaction, client, 'Reaction role configured', `Emoji **${emoji}** will grant **${role.name}** when used on message **${messageId}**.`);
  },
  async executePrefix(message, args, client) {
    if (args.length < 3) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}reactionrole <message_id> <emoji> @role\``)], flags: MessageFlags.IsComponentsV2 });
    const messageId = args[0];
    const emoji = args[1];
    const role = message.mentions.roles.first();
    if (!role) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}reactionrole <message_id> <emoji> @role\``)], flags: MessageFlags.IsComponentsV2 });
    await ReactionRole.create({ guildId: message.guild.id, messageId, emoji, roleId: role.id, channelId: message.channel.id });
    return message.reply({ components: [renderPanel(client, 'Reaction role configured', `Emoji **${emoji}** will grant **${role.name}** when used on message **${messageId}**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
