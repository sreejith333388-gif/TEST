const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');

function dashboard(client) {
  const commands = new Set(client.commands.values());
  return `**Owner:** ${client.config.ownerName}\n**Bot:** ${client.config.name}\n**Configured owners:** ${client.config.owners.size}\n**Servers:** ${client.guilds.cache.size}\n**Unique loaded commands:** ${commands.size}\n**Maintenance:** ${client.runtime.maintenance ? 'ON' : 'OFF'}\n\nUse \`/ownerhelp\` for the available safe owner tools. Owner-only access is checked by user ID from \.env; it does not bypass Discord/server permissions.`;
}
module.exports = {
  name: 'ownerpanel', aliases: ['owner-dashboard'], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('ownerpanel').setDescription('Show the private owner dashboard.'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Owner dashboard', dashboard(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Owner dashboard', dashboard(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
