const { Events, MessageFlags } = require('discord.js');
const GuildConfig = require('../database/models/GuildConfig');
const AfkUser = require('../database/models/AfkUser');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;
    const mentioned = message.mentions.users.first();
    if (!mentioned) return;
    const afk = await AfkUser.findOne({ guildId: message.guild.id, userId: mentioned.id }).lean();
    if (!afk) return;
    const reason = afk.reason || 'AFK';
    await message.reply({ content: `**${mentioned.tag}** is AFK: ${reason}`, allowedMentions: { repliedUser: false } }).catch(() => {});
  }
};
