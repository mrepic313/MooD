// models/Diary.js
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],            // Array of tags for categorizing
  mood: {
    mood: { type: String },             // Mood type, e.g., "happy", "sad"
    intensity: { type: Number, default: 5 }, // Optional: mood intensity (scale 1-10)
    tags: [{ type: String }],            // Optional tags for categorizing
    note: { type: String },              // Optional note explaining the mood
  },
  createdAt: { type: Date, default: Date.now },
  suggestions: { type: String },
});

module.exports = mongoose.model('Diary', diarySchema);
