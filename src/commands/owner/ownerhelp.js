const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');

const lines = [
  '`/ownerpanel` — owner dashboard',
  '`/ownerhelp` — owner command guide',
  '`/ownerlist` — configured owner IDs',
  '`/botstats` — runtime and server counts',
  '`/servers` — server list summary',
  '`/commandstats` — loaded command counts',
  '`/database` — database connection state',
  '`/cacheinfo` — cache size summary',
  '`/clearcache` — clear user/message caches',
  '`/maintenance` — enable process-local maintenance mode',
  '`/maintenanceoff` — disable maintenance mode',
  '`/setstatus` — change presence status'
];

module.exports = {
  name: 'ownerhelp', aliases: ['ownercommands'], ownerOnly: true, cooldown: 3,
  data: new SlashCommandBuilder().setName('ownerhelp').setDescription('Show safe owner tools.'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, `${client.config.ownerName} · Owner tools`, lines.join('\n'));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, `${client.config.ownerName} · Owner tools`, lines.join('\n'))], flags: MessageFlags.IsComponentsV2 });
  }
};
