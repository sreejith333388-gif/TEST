const { Schema, model, models } = require('mongoose');

const moderationCaseSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  caseNumber: { type: Number, required: true },
  action: { type: String, required: true, enum: ['warn', 'timeout', 'kick', 'ban', 'purge'] },
  targetId: { type: String, default: null },
  moderatorId: { type: String, required: true },
  reason: { type: String, maxlength: 500, default: 'No reason provided' },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });
moderationCaseSchema.index({ guildId: 1, caseNumber: 1 }, { unique: true });
moderationCaseSchema.index({ guildId: 1, targetId: 1, createdAt: -1 });
module.exports = models.ModerationCase || model('ModerationCase', moderationCaseSchema);
