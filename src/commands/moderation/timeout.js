const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { createCase, sendModerationLog } = require('../../utils/moderation');

async function run(guild, client, target, reason, durationMs) {
  if (target.id === client.user.id) throw new Error('The bot cannot timeout itself.');
  const member = await guild.members.fetch(target.id);
  if (!member.moderatable) throw new Error('I cannot timeout this member; check role hierarchy and permissions.');
  const end = Date.now() + durationMs;
  await member.timeout(durationMs, reason || 'No reason provided');
  const record = await createCase({ guildId: guild.id, action: 'timeout', targetId: target.id, moderatorId: client.user.id, reason, expiresAt: new Date(end) });
  await sendModerationLog(guild, client, record);
  return `Timed out **${target.tag}** for ${Math.ceil(durationMs / 60000)} minute(s). Case: ${record ? `#${record.caseNumber}` : 'database unavailable'}.`;
}

module.exports = {
  name: 'timeout', aliases: ['mute'], cooldown: 3, permissions: [PermissionFlagsBits.ModerateMembers],
  data: new SlashCommandBuilder().setName('timeout').setDescription('Temporarily timeout a server member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('Member to timeout').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duration in minutes (1-40320)').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setMaxLength(500)),
  async execute(i, client) {
    const user = i.options.getUser('user');
    const minutes = i.options.getInteger('minutes');
    const reason = i.options.getString('reason') || 'No reason provided';
    try { return v2Reply(i, client, 'Timeout applied', await run(i.guild, client, user, reason, minutes * 60000)); }
    catch (e) { return v2Reply(i, client, 'Timeout failed', e.message); }
  },
  async executePrefix(m, args, client) {
    const target = m.mentions.users.first();
    const minutes = Number(args[1]);
    if (!target || !Number.isInteger(minutes) || minutes < 1 || minutes > 40320) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}timeout @member <minutes> [reason]\``)], flags: MessageFlags.IsComponentsV2 });
    try { return m.reply({ components: [renderPanel(client, 'Timeout applied', await run(m.guild, client, target, args.slice(2).join(' '), minutes * 60000))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Timeout failed', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
