const { Schema, model, models } = require('mongoose');

const reminderSchema = new Schema({
  guildId: { type: String, default: null, index: true },
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true, maxlength: 1000 },
  remindAt: { type: Date, required: true, index: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = models.Reminder || model('Reminder', reminderSchema);
