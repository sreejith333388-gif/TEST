const { Schema, model, models } = require('mongoose');

const ticketSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  creatorId: { type: String, required: true },
  channelId: { type: String, required: true },
  category: { type: String, default: 'general' },
  reason: { type: String, default: 'No reason provided' },
  status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' },
  assigneeId: { type: String, default: null },
  closedBy: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

ticketSchema.index({ guildId: 1, channelId: 1 }, { unique: true });
module.exports = models.Ticket || model('Ticket', ticketSchema);
