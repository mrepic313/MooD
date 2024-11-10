// src/pages/DiaryPage.js

import React, { useState, useEffect } from 'react';
import { 
    createDiaryEntry, 
    getDiaryEntries, 
    analyzeDiaryEntry, 
    getDiaryEntryById, 
    updateDiaryEntry, 
    deleteDiaryEntry, 
    getAverageMood 
  } from '../services/diaryService';
import '../styles/DiaryPage.css';

function DiaryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // For editing mode
  const [averageMood, setAverageMood] = useState(null); // For average mood intensity

  // Fetch all diary entries and the average mood intensity when the component loads
  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const fetchedDiaries = await getDiaryEntries();
        setDiaries(fetchedDiaries);
        
        const avgMood = await getAverageMood();
        setAverageMood(avgMood.averageIntensity);
      } catch (error) {
        console.error('Failed to fetch diaries or average mood:', error);
      }
      setLoading(false);
    };

    fetchDiaries();
  }, []);

  // Handle form submission to create or update a diary entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing entry
        const updatedEntry = await updateDiaryEntry(editingId, { title, content });
        setDiaries((prevDiaries) =>
          prevDiaries.map((entry) => (entry._id === editingId ? updatedEntry : entry))
        );
        setEditingId(null); // Exit editing mode
      } else {
        // Create a new entry
        const newEntry = await createDiaryEntry({ title, content, tags: [], mood: null });
        setDiaries([newEntry, ...diaries]);
      }
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating/updating diary entry:', error);
    }
  };

  // Edit an entry by loading its data into the form
  const handleEdit = async (diaryId) => {
    try {
      const diary = await getDiaryEntryById(diaryId);
      setTitle(diary.title);
      setContent(diary.content);
      setEditingId(diaryId); // Enter editing mode
    } catch (error) {
      console.error('Error fetching diary entry:', error);
    }
  };

  // Delete a diary entry
  const handleDelete = async (diaryId) => {
    try {
      await deleteDiaryEntry(diaryId);
      setDiaries((prevDiaries) => prevDiaries.filter((entry) => entry._id !== diaryId));
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  };

  // Analyze a specific diary entry for mood and suggestions
  const handleAnalyze = async (diaryId) => {
    try {
      const analyzedEntry = await analyzeDiaryEntry(diaryId);
      // Update the analyzed entry in the state with mood and suggestion data
      setDiaries((prevDiaries) =>
        prevDiaries.map((entry) =>
          entry._id === diaryId ? { ...entry, mood: analyzedEntry.mood, suggestions: analyzedEntry.suggestions } : entry
        )
      );
    } catch (error) {
      console.error('Error analyzing diary entry:', error);
    }
  };

  return (
    <div className="diary-page">
      <h2>Diary Page</h2>

      {/* Display average mood intensity */}
      {averageMood !== null && (
        <div className="average-mood">
          <h4>Average Mood Intensity: {averageMood.toFixed(2)}</h4>
        </div>
      )}

      {/* Form to create or update a diary entry */}
      <form onSubmit={handleSubmit} className="diary-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your diary entry..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="submit-button">{editingId ? 'Update Entry' : 'Add Entry'}</button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
            className="cancel-button"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}

      {/* List of all diary entries */}
      <div className="diary-entries">
        <h3>Your Diary Entries</h3>
        {diaries.map((diary) => (
          <div key={diary._id} className="diary-entry">
            <h4>{diary.title}</h4>
            <p>{diary.content}</p>
            {diary.mood && (
              <div className="mood-info">
                <p><strong>Mood:</strong> {diary.mood.mood} (Intensity: {diary.mood.intensity})</p>
                <p><strong>Mood Note:</strong> {diary.mood.note}</p>
              </div>
            )}
            {diary.suggestions && (
              <div className="suggestion-box" dangerouslySetInnerHTML={{ __html: diary.suggestions }} />
            )}
            <div className="entry-buttons">
              <button onClick={() => handleAnalyze(diary._id)} className="analyze-button">Analyze Mood</button>
              <button onClick={() => handleEdit(diary._id)} className="edit-button">Edit</button>
              <button onClick={() => handleDelete(diary._id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryPage;
