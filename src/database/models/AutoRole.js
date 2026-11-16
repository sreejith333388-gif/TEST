const { Schema, model, models } = require('mongoose');

const autoroleSchema = new Schema({
  guildId: { type: String, required: true, unique: true, index: true },
  roleId: { type: String, default: null },
  enabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = models.AutoRole || model('AutoRole', autoroleSchema);
