import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiaryPage from './pages/DiaryPage';
import { getAverageMood } from './services/diaryService';
import { getBackgroundColor } from './utils/getBackgroundColor';

function App() {
  const [averageMoodIntensity, setAverageMoodIntensity] = useState(5); // Default to neutral mood

  // Fetch the average mood intensity from the backend
  useEffect(() => {
    const fetchAverageMood = async () => {
      try {
        const data = await getAverageMood();
        setAverageMoodIntensity(data.averageIntensity || 5);
      } catch (error) {
        console.error('Failed to fetch average mood intensity:', error);
      }
    };

    fetchAverageMood();
  }, []);

  // Determine background color based on mood intensity
  const backgroundColor = getBackgroundColor(averageMoodIntensity);

  return (
    <div style={{ backgroundColor, minHeight: '100vh', minWidth: '100vw', transition: 'background-color 0.5s ease' }}>
      <Router>
        <h1 className="app-title">MooD</h1>
        <nav>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
          <a href="/diary">Diary</a>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/diary" element={<DiaryPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;