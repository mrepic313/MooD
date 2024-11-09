// controllers/diaryController.js
const Diary = require('../models/Diary');

// Create a new diary entry
const createDiaryEntry = async (req, res) => {
  try {
    const { title, content, tags, mood } = req.body;
    const diaryEntry = new Diary({
      user: req.user._id,
      title,
      content,
      tags,
      mood,
    });
    const savedEntry = await diaryEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating diary entry', error });
  }
};

// Fetch all diary entries for the logged-in user
const getDiaryEntries = async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching diary entries', error });
  }
};

// Fetch a single diary entry by ID
const getDiaryEntryById = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);
    if (entry && entry.user.toString() === req.user._id.toString()) {
      res.status(200).json(entry);
    } else {
      res.status(404).json({ message: 'Diary entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching diary entry', error });
  }
};

// Update an existing diary entry
const updateDiaryEntry = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);
    if (entry && entry.user.toString() === req.user._id.toString()) {
      entry.title = req.body.title || entry.title;
      entry.content = req.body.content || entry.content;
      entry.tags = req.body.tags || entry.tags;
      entry.mood = req.body.mood || entry.mood;
      const updatedEntry = await entry.save();
      res.status(200).json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Diary entry not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating diary entry', error });
  }
};

// Delete a diary entry
const deleteDiaryEntry = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);
    if (entry && entry.user.toString() === req.user._id.toString()) {
      await entry.remove();
      res.status(200).json({ message: 'Diary entry deleted' });
    } else {
      res.status(404).json({ message: 'Diary entry not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting diary entry', error });
  }
};

module.exports = {
  createDiaryEntry,
  getDiaryEntries,
  getDiaryEntryById,
  updateDiaryEntry,
  deleteDiaryEntry,
};
