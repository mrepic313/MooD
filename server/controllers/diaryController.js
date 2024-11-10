// controllers/diaryController.js
const Diary = require('../models/Diary');
const axios = require('axios');
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
      await entry.deleteOne({_id: req.params.id});
      res.status(200).json({ message: 'Diary entry deleted' });
    } else {
      res.status(404).json({ message: 'Diary entry not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting diary entry', error });
  }
};

// controllers/diaryController.js

// Calculate average mood intensity for the user's diary entries
const getAverageMood = async (req, res) => {
    try {
      const entries = await Diary.find({ user: req.user._id, 'mood.intensity': { $exists: true } });
      if (entries.length === 0) {
        return res.status(200).json({ message: 'No mood data available', averageIntensity: null });
      }
  
      const totalIntensity = entries.reduce((sum, entry) => sum + (entry.mood.intensity || 0), 0);
      const averageIntensity = totalIntensity / entries.length;
      
      res.status(200).json({ averageIntensity });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating average mood', error });
    }
  };

  const analyzeDiary = async (req, res) => {
    const { diaryId } = req.body;

    if (!diaryId) {
        return res.status(400).json({ error: 'DiaryId is required' });
    }

    try {
        const diaryEntry = await Diary.findById(diaryId);
        if (!diaryEntry || diaryEntry.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: 'Diary entry not found or not authorized' });
        }

        const { content } = diaryEntry;

        try {
            const response = await axios.post('http://localhost:5002/analyze', { content });

            // Get emotions and suggestion from the response
            let { emotions, suggestion } = response.data;

            // Sort emotions by score and prepare mood data
            emotions = emotions.sort((a, b) => b[1] - a[1]).slice(0, 5)
                               .map(([label, score]) => ({ label, score }));

            diaryEntry.mood = {
                mood: emotions[0]?.label || "neutral",
                intensity: Math.round(emotions[0]?.score * 10) || 5,
                tags: emotions.map(e => e.label),
                note: `Top emotions: ${emotions.map(e => `${e.label} (${Math.round(e.score * 100)}%)`).join(", ")}`
            };

            diaryEntry.suggestions = suggestion;
            const updatedEntry = await diaryEntry.save();
            res.status(200).json(updatedEntry);
        } catch (axiosError) {
            console.error('Error connecting to Flask service:', axiosError.message);
            res.status(502).json({ error: 'Failed to connect to emotion analysis service' });
        }
    } catch (error) {
        console.error('Error analyzing emotions:', error);
        res.status(500).json({ error: 'Failed to analyze emotions' });
    }
};

  
  module.exports = {
    createDiaryEntry,
    getDiaryEntries,
    getDiaryEntryById,
    updateDiaryEntry,
    deleteDiaryEntry,
    getAverageMood,
    analyzeDiary,  // Export the new function
  };
