const mongoose = require('mongoose');
const ModerationCase = require('../database/models/ModerationCase');
const { getGuildConfig } = require('../database/guildConfig');
const { renderPanel } = require('./ui');
const { MessageFlags } = require('discord.js');

async function createCase({ guildId, action, targetId = null, moderatorId, reason, expiresAt = null }) {
  if (mongoose.connection.readyState !== 1) return null;
  const caseNumber = await ModerationCase.countDocuments({ guildId }) + 1;
  return ModerationCase.create({ guildId, caseNumber, action, targetId, moderatorId, reason: reason || 'No reason provided', expiresAt });
}

async function sendModerationLog(guild, client, record) {
  if (!record) return;
  const config = await getGuildConfig(guild.id);
  if (!config?.logChannelId) return;
  const channel = guild.channels.cache.get(config.logChannelId) || await guild.channels.fetch(config.logChannelId).catch(() => null);
  if (!channel?.isTextBased()) return;
  const target = record.targetId ? `<@${record.targetId}> (${record.targetId})` : 'Not applicable';
  await channel.send({ components: [renderPanel(client, `Moderation case #${record.caseNumber}`, `**Action:** ${record.action}\n**Target:** ${target}\n**Moderator:** <@${record.moderatorId}>\n**Reason:** ${record.reason}`)], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
}

module.exports = { createCase, sendModerationLog };
