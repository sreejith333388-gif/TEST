const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const ModerationCase = require('../../database/models/ModerationCase');
const { renderPanel, v2Reply } = require('../../utils/ui');

async function list(guildId, userId) {
  const rows = await ModerationCase.find({ guildId, targetId: userId, action: 'warn' }).sort({ createdAt: -1 }).limit(10).lean();
  return rows.length ? rows.map(r => `**#${r.caseNumber}** <t:${Math.floor(r.createdAt.getTime()/1000)}:R> — ${r.reason} (by <@${r.moderatorId}>)`).join('\n') : 'No warnings found.';
}
module.exports = {
  name: 'warnings', aliases: ['warns'], cooldown: 3, permissions: [PermissionFlagsBits.ModerateMembers],
  data: new SlashCommandBuilder().setName('warnings').setDescription('List a member’s recent warnings.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('Member to inspect').setRequired(true)),
  async execute(i, client) {
    try { return v2Reply(i, client, `Warnings for ${i.options.getUser('user').tag}`, await list(i.guildId, i.options.getUser('user').id)); }
    catch (e) { return v2Reply(i, client, 'Could not load warnings', 'Ensure MongoDB is configured and try again.'); }
  },
  async executePrefix(m, args, client) {
    const target = m.mentions.users.first();
    if (!target) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}warnings @user\``)], flags: MessageFlags.IsComponentsV2 });
    try { return m.reply({ components: [renderPanel(client, `Warnings for ${target.tag}`, await list(m.guild.id, target.id))], flags: MessageFlags.IsComponentsV2 }); }
    catch { return m.reply({ components: [renderPanel(client, 'Could not load warnings', 'Ensure MongoDB is configured and try again.')], flags: MessageFlags.IsComponentsV2 }); }
  }
};
