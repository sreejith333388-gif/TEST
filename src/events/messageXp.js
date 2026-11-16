const { MessageFlags } = require('discord.js');
const LevelUser = require('../database/models/LevelUser');
const { getLevelFromXp } = require('../database/economy');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;
    const len = message.content.length;
    const bonus = Math.max(5, Math.min(18, Math.floor(len / 20)));
    const record = await LevelUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record) {
      await LevelUser.create({ guildId: message.guild.id, userId: message.author.id, xp: bonus, level: getLevelFromXp(bonus) });
      return;
    }
    const nextXp = (record.xp || 0) + bonus;
    record.xp = nextXp;
    record.level = getLevelFromXp(nextXp);
    await record.save();
    if (message.content.startsWith(client.config.prefix)) return;
  }
};
