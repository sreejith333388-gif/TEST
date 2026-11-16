const { Schema, model, models } = require('mongoose');

const reactionRoleSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  messageId: { type: String, required: true },
  emoji: { type: String, required: true },
  roleId: { type: String, required: true },
  channelId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

reactionRoleSchema.index({ guildId: 1, messageId: 1, emoji: 1 }, { unique: true });
module.exports = models.ReactionRole || model('ReactionRole', reactionRoleSchema);
