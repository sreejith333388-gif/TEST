const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');
const GuildConfig = require('../../database/models/GuildConfig');
const { renderPanel, v2Reply } = require('../../utils/ui');

async function update(guildId, values) {
  if (mongoose.connection.readyState !== 1) throw new Error('MongoDB is required to persist security settings.');
  const $set = {};
  for (const [key, value] of Object.entries(values)) if (value !== null && value !== undefined) $set[`security.${key}`] = value;
  if (!Object.keys($set).length) throw new Error('Choose at least one setting to update.');
  return GuildConfig.findOneAndUpdate({ guildId }, { $set }, { upsert: true, new: true, runValidators: true }).lean();
}
function show(config) {
  const s = config?.security || {};
  return `**Enabled:** ${Boolean(s.enabled)}\n**Block invites:** ${Boolean(s.antiInvite)}\n**Block links:** ${Boolean(s.antiLink)}\n**Anti-spam:** ${Boolean(s.antiSpam)}\n**Spam threshold:** ${s.maxMessages || 6} messages / ${s.intervalSeconds || 8}s`;
}
module.exports = {
  name: 'security', aliases: ['automod'], cooldown: 5,
  permissions: [PermissionFlagsBits.ManageGuild],
  data: new SlashCommandBuilder().setName('security').setDescription('Configure opt-in basic anti-invite/link/spam filters.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addBooleanOption(o => o.setName('enabled').setDescription('Enable or disable the server filters'))
    .addBooleanOption(o => o.setName('anti_invite').setDescription('Delete Discord invite links'))
    .addBooleanOption(o => o.setName('anti_link').setDescription('Delete links (may affect legitimate links)'))
    .addBooleanOption(o => o.setName('anti_spam').setDescription('Delete rapid message bursts')),
  async execute(i, client) {
    try {
      const opts = i.options;
      const updated = await update(i.guildId, {
        enabled: opts.getBoolean('enabled'), antiInvite: opts.getBoolean('anti_invite'),
        antiLink: opts.getBoolean('anti_link'), antiSpam: opts.getBoolean('anti_spam')
      });
      return v2Reply(i, client, 'Security settings saved', `${show(updated)}\n\nOnly enabled in this server. Requires Manage Messages for message removal.`);
    } catch (e) { return v2Reply(i, client, 'Could not save security settings', e.message); }
  },
  async executePrefix(m, args, client) {
    const action = (args[0] || '').toLowerCase();
    if (!['on', 'off'].includes(action)) return m.reply({ components: [renderPanel(client, 'Security settings', `Current filters:\n${show(await GuildConfig.findOne({ guildId: m.guild.id }).lean())}\n\nUse \`${client.config.prefix}security on\` or \`${client.config.prefix}security off\`. Fine-grained toggles are available as slash command options.`)], flags: MessageFlags.IsComponentsV2 });
    try {
      const updated = await update(m.guild.id, { enabled: action === 'on' });
      return m.reply({ components: [renderPanel(client, 'Security settings saved', show(updated))], flags: MessageFlags.IsComponentsV2 });
    } catch (e) { return m.reply({ components: [renderPanel(client, 'Could not save settings', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
