// models/Diary.js
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],            // Array of tags for categorizing
  mood: { type: String },               // Mood associated with the entry
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Diary', diarySchema);
