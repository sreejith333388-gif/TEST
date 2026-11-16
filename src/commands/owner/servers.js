const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function content(client) {
  const rows = [...client.guilds.cache.values()].slice(0, 40).map((g) => `• ${g.name} — \`${g.id}\``);
  return `Showing up to 40 of ${client.guilds.cache.size} server(s).\n${rows.join('\n') || 'No cached servers.'}`;
}
module.exports = {
  name: 'servers', aliases: ['serverlist'], ownerOnly: true, cooldown: 10,
  data: new SlashCommandBuilder().setName('servers').setDescription('Show a bounded server list (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Connected servers', content(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Connected servers', content(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
