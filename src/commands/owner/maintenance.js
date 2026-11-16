const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
function setMode(client, enabled, actor) {
  client.runtime.maintenance = enabled;
  console.info(JSON.stringify({ event: 'owner_action', action: enabled ? 'maintenance_on' : 'maintenance_off', actor, at: new Date().toISOString() }));
  return `Process-local maintenance mode is now **${enabled ? 'ON' : 'OFF'}**. Restarting the process resets this setting.`;
}
function command(name, enabled) {
  return {
    name, aliases: [], ownerOnly: true, cooldown: 3,
    data: new SlashCommandBuilder().setName(name).setDescription(`${enabled ? 'Enable' : 'Disable'} process-local maintenance mode.`),
    async execute(i, client) {
      if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
      return v2Reply(i, client, 'Maintenance setting updated', setMode(client, enabled, i.user.id));
    },
    async executePrefix(m, args, client) {
      if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
      return m.reply({ components: [renderPanel(client, 'Maintenance setting updated', setMode(client, enabled, m.author.id))], flags: MessageFlags.IsComponentsV2 });
    }
  };
}
module.exports = command(process.env.COMMAND_NAME || 'maintenance', true);
