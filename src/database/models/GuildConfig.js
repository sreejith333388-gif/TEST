const { Schema, model, models } = require('mongoose');

const guildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  prefix: { type: String, default: null, maxlength: 8 },
  disabledCommands: { type: [String], default: [] },
  logChannelId: { type: String, default: null },
  locale: { type: String, default: 'en' },
  security: {
    enabled: { type: Boolean, default: false },
    antiInvite: { type: Boolean, default: false },
    antiLink: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false },
    maxMessages: { type: Number, default: 6, min: 3, max: 15 },
    intervalSeconds: { type: Number, default: 8, min: 3, max: 30 }
  }
}, { timestamps: true });

guildConfigSchema.index({ guildId: 1 }, { unique: true });
module.exports = models.GuildConfig || model('GuildConfig', guildConfigSchema);
