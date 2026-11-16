const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function content(client) {
  const unique = new Map();
  for (const command of client.commands.values()) unique.set(command.name, command);
  const categories = {};
  for (const command of unique.values()) {
    const category = command.category || 'uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  }
  return `**Unique commands:** ${unique.size}\n**Registered names including aliases:** ${client.commands.size}\n**By category:** ${Object.entries(categories).map(([k,v]) => `${k}: ${v}`).join(', ') || 'No categories tagged'}`;
}
module.exports = {
  name: 'commandstats', aliases: ['cmdstats'], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('commandstats').setDescription('Show loaded command counts (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Command statistics', content(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Command statistics', content(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
