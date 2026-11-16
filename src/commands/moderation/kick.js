const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { createCase, sendModerationLog } = require('../../utils/moderation');

async function run(guild, client, target, reason) {
  if (target.id === client.user.id) throw new Error('The bot cannot kick itself.');
  const member = await guild.members.fetch(target.id);
  if (!member.kickable) throw new Error('I cannot kick this member; check role hierarchy and permissions.');
  await member.kick(reason || 'No reason provided');
  const record = await createCase({ guildId: guild.id, action: 'kick', targetId: target.id, moderatorId: client.user.id, reason });
  await sendModerationLog(guild, client, record);
  return `Kicked **${target.tag}**. Case: ${record ? `#${record.caseNumber}` : 'database unavailable'}.`;
}

module.exports = {
  name: 'kick', aliases: [], cooldown: 3, permissions: [PermissionFlagsBits.KickMembers],
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a member from this server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setMaxLength(500)),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Kick complete', await run(i.guild, client, i.options.getUser('user'), i.options.getString('reason'))); }
    catch (e) { return v2Reply(i, client, 'Kick failed', e.message); }
  },
  async executePrefix(m, args, client) {
    const target = m.mentions.users.first();
    if (!target) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}kick @member [reason]\``)], flags: MessageFlags.IsComponentsV2 });
    try { return m.reply({ components: [renderPanel(client, 'Kick complete', await run(m.guild, client, target, args.slice(1).join(' ')))], flags: MessageFlags.IsComponentsV2 }); }
    catch (e) { return m.reply({ components: [renderPanel(client, 'Kick failed', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
