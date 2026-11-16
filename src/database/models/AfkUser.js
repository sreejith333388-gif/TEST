const { Schema, model, models } = require('mongoose');

const afkUserSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  reason: { type: String, default: 'AFK', maxlength: 200 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

afkUserSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = models.AfkUser || model('AfkUser', afkUserSchema);
