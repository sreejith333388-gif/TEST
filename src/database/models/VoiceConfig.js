const { Schema, model, models } = require('mongoose');

const voiceConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  categoryId: { type: String, default: null },
  maxUsers: { type: Number, default: 0 },
  createEnabled: { type: Boolean, default: true },
  lockEnabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = models.VoiceConfig || model('VoiceConfig', voiceConfigSchema);
