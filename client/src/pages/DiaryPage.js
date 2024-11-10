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
  const [editingId, setEditingId] = useState(null);
  const [averageMood, setAverageMood] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedEntry = await updateDiaryEntry(editingId, { title, content });
        setDiaries((prevDiaries) =>
          prevDiaries.map((entry) => (entry._id === editingId ? updatedEntry : entry))
        );
        setEditingId(null);
      } else {
        const newEntry = await createDiaryEntry({ title, content, tags: [], mood: null });
        setDiaries([newEntry, ...diaries]);
      }
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating/updating diary entry:', error);
    }
  };

  const handleEdit = async (diaryId) => {
    try {
      const diary = await getDiaryEntryById(diaryId);
      setTitle(diary.title);
      setContent(diary.content);
      setEditingId(diaryId);
    } catch (error) {
      console.error('Error fetching diary entry:', error);
    }
  };

  const handleDelete = async (diaryId) => {
    try {
      await deleteDiaryEntry(diaryId);
      setDiaries((prevDiaries) => prevDiaries.filter((entry) => entry._id !== diaryId));
    } catch (error) {
      console.error('Error deleting diary entry:', error);
    }
  };

// Save the analyzed suggestions to localStorage after fetching
const handleAnalyze = async (diaryId) => {
    try {
      const analyzedEntry = await analyzeDiaryEntry(diaryId);
      
      const formattedSuggestions = formatSuggestion(analyzedEntry.suggestions);
  
      // Save to local storage
      localStorage.setItem(`suggestions_${diaryId}`, formattedSuggestions);
  
      // Update state
      setDiaries((prevDiaries) =>
        prevDiaries.map((entry) =>
          entry._id === diaryId ? { ...entry, mood: analyzedEntry.mood, suggestions: formattedSuggestions } : entry
        )
      );
    } catch (error) {
      console.error('Error analyzing diary entry:', error);
    }
  };
  
  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const fetchedDiaries = await getDiaryEntries();

        // Merge stored suggestions from localStorage
        const mergedDiaries = fetchedDiaries.map((diary) => {
          const storedSuggestion = localStorage.getItem(`suggestions_${diary._id}`);
          return storedSuggestion ? { ...diary, suggestions: storedSuggestion } : diary;
        });

        setDiaries(mergedDiaries);

        const avgMood = await getAverageMood();
        setAverageMood(avgMood.averageIntensity);
      } catch (error) {
        console.error('Failed to fetch diaries or average mood:', error);
      }
      setLoading(false);
    };

    fetchDiaries();
  }, []);
  

// Helper function to extract each section based on a case-insensitive section title
const extractSection = (text, sectionTitle) => {
    const lowerText = text.toLowerCase();
    const lowerTitle = `### ${sectionTitle.toLowerCase()}`;
    const start = lowerText.indexOf(lowerTitle);
    if (start === -1) return null;

    const end = lowerText.indexOf("###", start + 1);
    const section = text.slice(start, end === -1 ? text.length : end).replace(new RegExp(`### ${sectionTitle}`, "i"), '').trim();
    return section;
};

// Function to format suggestions by extracting and styling sections, removing all asterisks
const formatSuggestion = (suggestions) => {
    const primaryEmotions = (extractSection(suggestions, "Primary Emotions") || "No primary emotions available.").replace(/\*/g, "");
    const tips = (extractSection(suggestions, "Suggestions") || "No suggestions available.").replace(/\*/g, "");
    const quote = (extractSection(suggestions, "Quote of the Day") || "No quote available.").replace(/\*/g, "");

    return `
        <div>
            <h4><strong>Primary Emotions</strong></h4>
            <p>${primaryEmotions}</p>
            <h4><strong>Suggestions</strong></h4>
            <p>${tips}</p>
            <h4><strong>Quote of the Day</strong></h4>
            <p>${quote}</p>
        </div>
    `;
};



  return (
    <div className="diary-page">
      <h2>Diary Page</h2>

      {averageMood !== null && (
        <div className="average-mood">
          <h4>Average Mood Intensity: {averageMood.toFixed(2)}</h4>
        </div>
      )}

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
