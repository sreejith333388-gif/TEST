const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { createCase, sendModerationLog } = require('../../utils/moderation');
const ModerationCase = require('../../database/models/ModerationCase');

async function run(guild, client, target, reason) {
  const record = await createCase({ guildId: guild.id, action: 'warn', targetId: target.id, moderatorId: client.user.id, reason });
  if (!record) throw new Error('Warning storage needs MongoDB configured; no warning was recorded.');
  await sendModerationLog(guild, client, record);
  try { await target.send({ components: [renderPanel(client, `Warning from ${guild.name}`, `Reason: ${reason || 'No reason provided'}\nCase: #${record.caseNumber}`)], flags: MessageFlags.IsComponentsV2 }); } catch {}
  return `Warned **${target.tag}**. Case: #${record.caseNumber}.`;
}

module.exports = {
  name: 'warn', aliases: [], cooldown: 3, permissions: [PermissionFlagsBits.ModerateMembers],
  data: new SlashCommandBuilder().setName('warn').setDescription('Record a warning for a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true).setMaxLength(500)),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Warning recorded', await run(i.guild, client, i.options.getUser('user'), i.options.getString('reason'))); }
    catch (e) { return v2Reply(i, client, 'Warning failed', e.message); }
  },
  async executePrefix(m, args, client) {
    const target = m.mentions.users.first();
    const reason = args.slice(1).join(' ');
    if (!target || !reason) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}warn @user <reason>\``)], flags: MessageFlags.IsComponentsV2 });
    try { return m.reply({ components: [renderPanel(client, 'Warning recorded', await run(m.guild, client, target, reason))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Warning failed', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
