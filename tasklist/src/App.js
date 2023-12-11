// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import AnimeSearch from './Pages/AnimeSearch';
import AnimeList from './Pages/AnimeList';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animeData, setAnimeData] = useState(null);
  const [savedAnime, setSavedAnime] = useState(JSON.parse(localStorage.getItem('SavedAnime')) || []);

  const isSaved = (item) => {
    // Retrieve the existing saved anime from local storage
    const savedAnime = JSON.parse(localStorage.getItem('SavedAnime')) || [];

    // Check if the anime is already saved based on mal_id
    return savedAnime.some((savedItem) => savedItem.mal_id === item.mal_id);
  };

  const handleSaveToLocalStorage = (item) => {
    // Check if the anime is already saved based on mal_id
    const isAlreadySaved = savedAnime.some((savedItem) => savedItem.mal_id === item.mal_id);

    if (!isAlreadySaved) {
      // Add the anime to the saved list
      const updatedAnime = [...savedAnime, item];
      setSavedAnime(updatedAnime);

      // Save the updated list to local storage
      localStorage.setItem('SavedAnime', JSON.stringify(updatedAnime));

      console.log(`Saved "${item.title}" to local storage.`);
    } else {
      // Remove the anime from the saved list
      const updatedAnimeList = savedAnime.filter((savedItem) => savedItem.mal_id !== item.mal_id);
      setSavedAnime(updatedAnimeList);

      // Save the updated list to local storage
      localStorage.setItem('SavedAnime', JSON.stringify(updatedAnimeList));

      console.log(`Removed "${item.title}" from local storage.`);
    }
  };
  
  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&sfw`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const first100Items = data.data.slice(0, 100);
        setAnimeData(first100Items);
      } else {
        console.error('Data is not in the expected format or is empty:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <h1>AniList</h1>
      <div>
        <input
          type="text"
          placeholder="Enter anime name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display anime data */}
      {animeData && (
        <div className="anime-list">
          {animeData.map((item, index) => (
            <div key={index} className={`anime-item ${isSaved(item) ? 'saved' : ''}`} style={{ backgroundImage: `url(${item.images?.jpg?.image_url})` }}>
              <h2 className="title">{item.title}</h2>
              <p className="episodes">Episodes: {item.episodes}</p>

              {/* Button on the bottom left (initially hidden) */}
              <button className="bottom-left-button" onClick={() => handleSaveToLocalStorage(item)}>
                Save
              </button>

              {/* Saved badge */}
              {isSaved(item) && <div className="saved-badge">Saved</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;