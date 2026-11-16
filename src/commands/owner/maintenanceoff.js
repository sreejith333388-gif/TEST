const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
module.exports = {
  name: 'maintenanceoff', aliases: [], ownerOnly: true, cooldown: 3,
  data: new SlashCommandBuilder().setName('maintenanceoff').setDescription('Disable process-local maintenance mode.'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    client.runtime.maintenance = false;
    console.info(JSON.stringify({ event: 'owner_action', action: 'maintenance_off', actor: i.user.id, at: new Date().toISOString() }));
    return v2Reply(i, client, 'Maintenance mode disabled', 'The bot is accepting commands again.');
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    client.runtime.maintenance = false;
    console.info(JSON.stringify({ event: 'owner_action', action: 'maintenance_off', actor: m.author.id, at: new Date().toISOString() }));
    return m.reply({ components: [renderPanel(client, 'Maintenance mode disabled', 'The bot is accepting commands again.')], flags: MessageFlags.IsComponentsV2 });
  }
};
