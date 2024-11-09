// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const moodRoutes = require('./routes/moodRoutes');  // Import mood routes

require('dotenv').config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/moods', moodRoutes);    // Use mood routes

module.exports = app;
