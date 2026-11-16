const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { createCase, sendModerationLog } = require('../../utils/moderation');

async function run(guild, client, target, reason, deleteDays) {
  if (target.id === client.user.id) throw new Error('The bot cannot ban itself.');
  const member = await guild.members.fetch(target.id).catch(() => null);
  if (member && !member.bannable) throw new Error('I cannot ban this member; check role hierarchy and permissions.');
  await guild.members.ban(target.id, { reason: reason || 'No reason provided', deleteMessageSeconds: deleteDays * 86400 });
  const record = await createCase({ guildId: guild.id, action: 'ban', targetId: target.id, moderatorId: client.user.id, reason });
  await sendModerationLog(guild, client, record);
  return `Banned **${target.tag}**. Case: ${record ? `#${record.caseNumber}` : 'database unavailable'}.`;
}

module.exports = {
  name: 'ban', aliases: [], cooldown: 3, permissions: [PermissionFlagsBits.BanMembers],
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user from this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setMaxLength(500))
    .addIntegerOption(o => o.setName('delete_days').setDescription('Delete recent message history (0-7 days)').setMinValue(0).setMaxValue(7)),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Ban complete', await run(i.guild, client, i.options.getUser('user'), i.options.getString('reason'), i.options.getInteger('delete_days') || 0)); }
    catch (e) { return v2Reply(i, client, 'Ban failed', e.message); }
  },
  async executePrefix(m, args, client) {
    const target = m.mentions.users.first();
    if (!target) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}ban @user [reason]\``)], flags: MessageFlags.IsComponentsV2 });
    try { return m.reply({ components: [renderPanel(client, 'Ban complete', await run(m.guild, client, target, args.slice(1).join(' '), 0))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Ban failed', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
