const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function content() {
  const state = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  return `**State:** ${state}\n**Host configured:** ${Boolean(process.env.MONGODB_URI)}\nDatabase credentials are never displayed.`;
}
module.exports = {
  name: 'database', aliases: ['dbstatus'], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('database').setDescription('Show safe database connection status (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Database status', content());
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Database status', content())], flags: MessageFlags.IsComponentsV2 });
  }
};
