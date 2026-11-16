const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function clear(client) {
  const before = client.users.cache.size;
  client.users.cache.sweep((user) => user.id !== client.user.id);
  return `Swept ${before - client.users.cache.size} cached user entries. Guilds, channels, messages, and live command data were left untouched.`;
}
module.exports = {
  name: 'clearcache', aliases: [], ownerOnly: true, cooldown: 30,
  data: new SlashCommandBuilder().setName('clearcache').setDescription('Sweep non-bot user cache entries (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    const result = clear(client);
    console.info(JSON.stringify({ event: 'owner_action', action: 'clearcache', actor: i.user.id, at: new Date().toISOString() }));
    return v2Reply(i, client, 'Cache sweep complete', result);
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    const result = clear(client);
    console.info(JSON.stringify({ event: 'owner_action', action: 'clearcache', actor: m.author.id, at: new Date().toISOString() }));
    return m.reply({ components: [renderPanel(client, 'Cache sweep complete', result)], flags: MessageFlags.IsComponentsV2 });
  }
};
