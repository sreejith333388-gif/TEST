const { Schema, model, models } = require('mongoose');

const guildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  prefix: { type: String, default: null, maxlength: 8 },
  disabledCommands: { type: [String], default: [] },
  logChannelId: { type: String, default: null },
  locale: { type: String, default: 'en' }
}, { timestamps: true });

guildConfigSchema.index({ guildId: 1 }, { unique: true });
module.exports = models.GuildConfig || model('GuildConfig', guildConfigSchema);
