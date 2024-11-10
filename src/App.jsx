import React, { useState } from 'react';

function App() {
  // State to store the journal entry text
  const [entry, setEntry] = useState("");
  // State to store all submitted journal entries
  const [journalEntries, setJournalEntries] = useState([]);

  // Handle input changes
  const handleInputChange = (event) => {
    setEntry(event.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Add the current entry to the journalEntries list
    if (entry.trim() !== "") {
      setJournalEntries([...journalEntries, entry]);
      setEntry("");  // Clear the textarea after submission
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to MooD</h1>
        <p>What's on your mind?</p>
        
        {/* Textarea for user input */}
        <textarea
          value={entry}           // Bind the state to the textarea
          onChange={handleInputChange}  // Update state when text changes
          rows="6"                 // Adjust row size for better visibility
          cols="50"                // Adjust width
          placeholder="Write your journal entry here..."
        />
        
        {/* Submit button */}
        <button onClick={handleSubmit}>Submit Entry</button>

        {/* Displaying all journal entries */}
        <div>
          <h2>Your Journal Entries:</h2>
          <ul>
            {journalEntries.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      </header>
      <footer>
        <p>© MooD inc.</p>
      </footer>
    </div>
  );
}

export default App;
