const mongoose = require('mongoose');
const { Schema, model, models } = require('mongoose');

const economyUserSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  lastWork: { type: Date, default: null },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
}, { timestamps: true });

economyUserSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = models.EconomyUser || model('EconomyUser', economyUserSchema);
