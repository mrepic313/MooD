// controllers/moodController.js
const Mood = require('../models/Mood');

// Create a new mood entry
const createMoodEntry = async (req, res) => {
  try {
    const { mood, intensity, tags, note } = req.body;
    const moodEntry = new Mood({
      user: req.user._id,
      mood,
      intensity,
      tags,
      note,
    });
    const savedMood = await moodEntry.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(500).json({ message: 'Error creating mood entry', error });
  }
};

// Get all mood entries for the logged-in user
const getMoodEntries = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood entries', error });
  }
};

// Update a mood entry by ID
const updateMoodEntry = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (mood && mood.user.toString() === req.user._id.toString()) {
      mood.mood = req.body.mood || mood.mood;
      mood.intensity = req.body.intensity || mood.intensity;
      mood.tags = req.body.tags || mood.tags;
      mood.note = req.body.note || mood.note;
      const updatedMood = await mood.save();
      res.status(200).json(updatedMood);
    } else {
      res.status(404).json({ message: 'Mood entry not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating mood entry', error });
  }
};

// Delete a mood entry
const deleteMoodEntry = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (mood && mood.user.toString() === req.user._id.toString()) {
      await mood.remove();
      res.status(200).json({ message: 'Mood entry deleted' });
    } else {
      res.status(404).json({ message: 'Mood entry not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mood entry', error });
  }
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  updateMoodEntry,
  deleteMoodEntry,
};
