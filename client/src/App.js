// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiaryPage from './pages/DiaryPage';
import MoodDashboard from './pages/MoodDashboard';

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>MooD App</h1>
        <nav>
          <Link to="/login" style={{ margin: '10px' }}>Login</Link>
          <Link to="/signup" style={{ margin: '10px' }}>Signup</Link>
          <Link to="/diary" style={{ margin: '10px' }}>Diary</Link>
          <Link to="/dashboard" style={{ margin: '10px' }}>Mood Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/dashboard" element={<MoodDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
