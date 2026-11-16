const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { renderPanel, v2Reply } = require('../../utils/ui');
const AFKUser = require('../../database/models/AfkUser');

module.exports = {
  name: 'remind',
  aliases: ['reminder'],
  cooldown: 3,
  data: new SlashCommandBuilder().setName('remind').setDescription('Set a reminder for yourself.')
    .addIntegerOption((o) => o.setName('minutes').setDescription('Minutes until reminder').setRequired(true).setMinValue(1).setMaxValue(10080))
    .addStringOption((o) => o.setName('message').setDescription('Reminder text').setRequired(true).setMaxLength(500)),
  async execute(interaction, client) {
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message');
    const remindAt = new Date(Date.now() + minutes * 60000);
    await new (require('../../database/models/Reminder'))({ guildId: interaction.guildId, userId: interaction.user.id, text: message, remindAt }).save();
    setTimeout(async () => {
      try { await interaction.user.send({ content: `⏰ Reminder: ${message}` }).catch(() => {}); }
      catch {}
    }, minutes * 60000).unref?.();
    return v2Reply(interaction, client, 'Reminder set', `I will remind you in **${minutes} minute(s)**.`);
  },
  async executePrefix(message, args, client) {
    if (!args[0] || !Number(args[0])) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}remind 15 Take a break\``)], flags: MessageFlags.IsComponentsV2 });
    const minutes = Number(args.shift());
    const text = args.join(' ');
    if (!text) return message.reply({ components: [renderPanel(client, 'Usage', `Use: \`${client.config.prefix}remind 15 Take a break\``)], flags: MessageFlags.IsComponentsV2 });
    const remindAt = new Date(Date.now() + minutes * 60000);
    await new (require('../../database/models/Reminder'))({ guildId: message.guild.id, userId: message.author.id, text, remindAt }).save();
    setTimeout(async () => { try { await message.author.send({ content: `⏰ Reminder: ${text}` }).catch(() => {}); } catch {} }, minutes * 60000).unref?.();
    return message.reply({ components: [renderPanel(client, 'Reminder set', `I will remind you in **${minutes} minute(s)**.`)], flags: MessageFlags.IsComponentsV2 });
  }
};
