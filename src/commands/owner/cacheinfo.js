const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function content(client) {
  return `**Guild cache:** ${client.guilds.cache.size}\n**User cache:** ${client.users.cache.size}\n**Channel cache:** ${client.channels.cache.size}\n**Command registry names:** ${client.commands.size}`;
}
module.exports = {
  name: 'cacheinfo', aliases: ['cache'], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('cacheinfo').setDescription('Show in-memory cache sizes (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Cache information', content(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Cache information', content(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
