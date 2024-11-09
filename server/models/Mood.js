// models/Mood.js
const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },   // Example moods: "happy", "sad", "neutral", etc.
  intensity: { type: Number, default: 5 },  // Optional: mood intensity on a scale from 1-10
  tags: [{ type: String }],                 // Optional tags to categorize moods
  note: { type: String },                   // Optional note or reason for the mood
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mood', moodSchema);
