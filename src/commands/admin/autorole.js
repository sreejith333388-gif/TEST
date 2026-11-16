const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../database/models/AutoRole');
const { renderPanel, v2Reply } = require('../../utils/ui');

module.exports = {
  name: 'autorole', aliases: ['setautorole'], cooldown: 5,
  permissions: [PermissionFlagsBits.ManageRoles],
  data: new SlashCommandBuilder().setName('autorole').setDescription('Enable an auto-role for new members.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption((o) => o.setName('role').setDescription('Role to grant to new members').setRequired(true))
    .addBooleanOption((o) => o.setName('enabled').setDescription('Enable or disable the auto-role').setRequired(false)),
  async execute(interaction, client) {
    const role = interaction.options.getRole('role');
    const enabled = interaction.options.getBoolean('enabled') ?? true;
    await AutoRole.findOneAndUpdate({ guildId: interaction.guildId }, { $set: { roleId: role.id, enabled } }, { upsert: true, new: true });
    return v2Reply(interaction, client, 'Auto-role updated', `Auto-role is now **${enabled ? 'enabled' : 'disabled'}** for **${role.name}**.`);
  },
  async executePrefix(message, args, client) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}autorole @role [on|off]\``)], flags: MessageFlags.IsComponentsV2 });
    const enabled = !(args[1] || '').toLowerCase().startsWith('off');
    await AutoRole.findOneAndUpdate({ guildId: message.guild.id }, { $set: { roleId: role.id, enabled } }, { upsert: true, new: true });
    return message.reply({ components: [renderPanel(client, 'Auto-role updated', `Auto-role is now **${enabled ? 'enabled' : 'disabled'}** for **${role.name}**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
