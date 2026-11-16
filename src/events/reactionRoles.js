const { Events, MessageFlags } = require('discord.js');
const ReactionRole = require('../database/models/ReactionRole');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user, client) {
    if (user.bot) return;
    if (!reaction.message.guild) return;
    const entry = await ReactionRole.findOne({ guildId: reaction.message.guild.id, messageId: reaction.message.id, emoji: reaction.emoji.name || reaction.emoji.id || reaction.emoji.toString() }).lean();
    if (!entry) return;
    const role = reaction.message.guild.roles.cache.get(entry.roleId) || await reaction.message.guild.roles.fetch(entry.roleId).catch(() => null);
    if (!role) return;
    const member = reaction.message.guild.members.cache.get(user.id) || await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (member) await member.roles.add(role).catch(() => {});
  }
};
