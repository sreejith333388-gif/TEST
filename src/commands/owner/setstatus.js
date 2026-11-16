const { SlashCommandBuilder, MessageFlags, ActivityType } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');
const allowed = new Map([['online','online'],['idle','idle'],['dnd','dnd'],['invisible','invisible']]);
module.exports = {
  name: 'setstatus', aliases: [], ownerOnly: true, cooldown: 5,
  data: new SlashCommandBuilder().setName('setstatus').setDescription('Set bot presence status (owner-only).')
    .addStringOption(o => o.setName('status').setDescription('Presence status').setRequired(true).addChoices(...[...allowed.keys()].map(x => ({ name: x, value: x })))),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    const status = i.options.getString('status');
    client.user.setPresence({ status, activities: [{ name: client.config.name, type: ActivityType.Playing }] });
    console.info(JSON.stringify({ event: 'owner_action', action: 'setstatus', status, actor: i.user.id, at: new Date().toISOString() }));
    return v2Reply(i, client, 'Presence updated', `Status set to **${status}**.`);
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    const status = allowed.get((args[0] || '').toLowerCase());
    if (!status) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}setstatus online|idle|dnd|invisible\``)], flags: MessageFlags.IsComponentsV2 });
    client.user.setPresence({ status, activities: [{ name: client.config.name, type: ActivityType.Playing }] });
    console.info(JSON.stringify({ event: 'owner_action', action: 'setstatus', status, actor: m.author.id, at: new Date().toISOString() }));
    return m.reply({ components: [renderPanel(client, 'Presence updated', `Status set to **${status}**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
