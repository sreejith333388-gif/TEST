const { Events, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../database/guildConfig');
const logger = require('../utils/logger');

const bursts = new Map();
const invitePattern = /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\/[\w-]+/i;
const linkPattern = /https?:\/\/[^\s]+/i;
const MAX_TRACKED_MEMBERS = 10000;

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (!message.guild || message.author.bot || !message.member) return;
    try {
      const config = await getGuildConfig(message.guild.id);
      const settings = config?.security;
      if (!settings?.enabled) return;
      const member = message.member;
      if (member.permissions.has(PermissionFlagsBits.ManageMessages) || member.permissions.has(PermissionFlagsBits.Administrator)) return;
      let reason = null;
      if (settings.antiInvite && invitePattern.test(message.content)) reason = 'Discord invite links are disabled here.';
      else if (settings.antiLink && linkPattern.test(message.content)) reason = 'Links are disabled here.';
      else if (settings.antiSpam) {
        const key = `${message.guild.id}:${message.author.id}`;
        const now = Date.now();
        const interval = Math.max(3, Math.min(30, settings.intervalSeconds || 8)) * 1000;
        const limit = Math.max(3, Math.min(15, settings.maxMessages || 6));
        const recent = (bursts.get(key) || []).filter((t) => now - t < interval);
        recent.push(now);
        bursts.set(key, recent);
        if (bursts.size > MAX_TRACKED_MEMBERS) {
          for (const [k, times] of bursts) if (!times.length || now - times[times.length - 1] > 60000) bursts.delete(k);
        }
        if (recent.length >= limit) reason = `Please slow down (${limit} messages in ${Math.round(interval / 1000)} seconds).`;
      }
      if (!reason) return;
      if (!message.channel.permissionsFor(client.user)?.has(PermissionFlagsBits.ManageMessages)) return;
      await message.delete().catch(() => null);
      await message.channel.send({ content: `<@${message.author.id}> ${reason}`, allowedMentions: { users: [message.author.id] } }).then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000).unref?.()).catch((error) => logger.warn('Automod notice failed', error));
    } catch (error) { logger.error('Security filter error', error); }
  }
};
