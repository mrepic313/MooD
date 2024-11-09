// routes/diaryRoutes.js
const express = require('express');
const axios = require('axios');
const Diary = require('../models/Diary')
const {
  createDiaryEntry,
  getDiaryEntries,
  getDiaryEntryById,
  updateDiaryEntry,
  deleteDiaryEntry,
  getAverageMood,
  analyzeDiary,
} = require('../controllers/diaryController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createDiaryEntry)          // Create a new diary entry
  .get(protect, getDiaryEntries);           // Get all diary entries for the user

router.route('/:id')
  .get(protect, getDiaryEntryById)          // Get a single diary entry by ID
  .put(protect, updateDiaryEntry)           // Update a diary entry
  .delete(protect, deleteDiaryEntry);       // Delete a diary entry

router.get('/average/mood', protect, getAverageMood);

router.post('/analyze', protect, analyzeDiary)
module.exports = router;
