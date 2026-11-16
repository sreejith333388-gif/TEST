const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const { createCase, sendModerationLog } = require('../../utils/moderation');

async function run(channel, client, amount) {
  const messages = await channel.bulkDelete(amount, true);
  const record = await createCase({ guildId: channel.guild.id, action: 'purge', moderatorId: client.user.id, reason: `Deleted ${messages.size} recent messages in #${channel.name}` });
  await sendModerationLog(channel.guild, client, record);
  return `Deleted **${messages.size}** recent messages. Messages older than 14 days cannot be bulk-deleted.`;
}
module.exports = {
  name: 'purge', aliases: ['clear'], cooldown: 5, permissions: [PermissionFlagsBits.ManageMessages],
  data: new SlashCommandBuilder().setName('purge').setDescription('Bulk-delete recent messages in this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(i, client) {
    try { return v2Reply(i, client, 'Purge complete', await run(i.channel, client, i.options.getInteger('amount'))); }
    catch (e) { return v2Reply(i, client, 'Purge failed', e.message); }
  },
  async executePrefix(m, args, client) {
    const amount = Number(args[0]);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100) return m.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}purge <1-100>\``)], flags: MessageFlags.IsComponentsV2 });
    try {
      const text = await run(m.channel, client, amount);
      return m.channel.send({ components: [renderPanel(client, 'Purge complete', text)], flags: MessageFlags.IsComponentsV2 });
    } catch (e) { return m.reply({ components: [renderPanel(client, 'Purge failed', e.message)], flags: MessageFlags.IsComponentsV2 }); }
  }
};
