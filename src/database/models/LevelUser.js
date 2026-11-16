const { Schema, model, models } = require('mongoose');

const levelUserSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastMessageAt: { type: Date, default: null }
}, { timestamps: true });

levelUserSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = models.LevelUser || model('LevelUser', levelUserSchema);
