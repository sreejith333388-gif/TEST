const { Events, MessageFlags } = require('discord.js');
const AutoRole = require('../database/models/AutoRole');
const { renderPanel } = require('../utils/ui');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const config = await AutoRole.findOne({ guildId: member.guild.id }).lean();
    if (!config || !config.enabled || !config.roleId) return;
    const role = member.guild.roles.cache.get(config.roleId) || await member.guild.roles.fetch(config.roleId).catch(() => null);
    if (!role) return;
    await member.roles.add(role).catch(() => {});
  }
};
