// routes/moodRoutes.js
const express = require('express');
const {
  createMoodEntry,
  getMoodEntries,
  updateMoodEntry,
  deleteMoodEntry,
} = require('../controllers/moodController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createMoodEntry)      // Create a new mood entry
  .get(protect, getMoodEntries);       // Get all mood entries for the user

router.route('/:id')
  .put(protect, updateMoodEntry)       // Update a specific mood entry
  .delete(protect, deleteMoodEntry);   // Delete a mood entry

module.exports = router;
