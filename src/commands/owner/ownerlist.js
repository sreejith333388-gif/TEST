const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const { renderPanel, v2Reply } = require('../../utils/ui');

function content(client) {
  return `**Owner name:** ${client.config.ownerName}\n**Configured owner IDs:** ${client.config.owners.size ? [...client.config.owners].map((id) => `\`${id}\``).join(', ') : 'None configured'}\n\nOwner IDs are read from the private \.env file.`;
}
module.exports = {
  name: 'ownerlist', aliases: ['botowners', 'botowner'], ownerOnly: true, cooldown: 3,
  data: new SlashCommandBuilder().setName('ownerlist').setDescription('List configured bot owners (owner-only).'),
  async execute(i, client) {
    if (!isOwner(i.user.id, client)) return v2Reply(i, client, 'Access denied', 'Configured bot owners only.');
    return v2Reply(i, client, 'Configured bot owners', content(client));
  },
  async executePrefix(m, args, client) {
    if (!isOwner(m.author.id, client)) return m.reply({ components: [renderPanel(client, 'Access denied', 'Configured bot owners only.')], flags: MessageFlags.IsComponentsV2 });
    return m.reply({ components: [renderPanel(client, 'Configured bot owners', content(client))], flags: MessageFlags.IsComponentsV2 });
  }
};
