import React, { useState } from 'react';
import './AnimeSearch.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animeData, setAnimeData] = useState(null);
  const [savedAnime, setSavedAnime] = useState(JSON.parse(localStorage.getItem('SavedAnime')) || []);

  const isSaved = (item) => {
    const savedAnime = JSON.parse(localStorage.getItem('SavedAnime')) || [];

    return savedAnime.some((savedItem) => savedItem.mal_id === item.mal_id);
  };

  const handleSaveToLocalStorage = (item) => {
    const isAlreadySaved = savedAnime.some((savedItem) => savedItem.mal_id === item.mal_id);

    if (!isAlreadySaved) {
      const updatedAnime = [...savedAnime, item];

      setSavedAnime(updatedAnime);

      localStorage.setItem('SavedAnime', JSON.stringify(updatedAnime));

      console.log(`Saved "${item.title}" to local storage.`);

    } else {
      const updatedAnimeList = savedAnime.filter((savedItem) => savedItem.mal_id !== item.mal_id);
      setSavedAnime(updatedAnimeList);

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

              <button className="bottom-left-button" onClick={() => handleSaveToLocalStorage(item)}>
                Save
              </button>

              {isSaved(item) && <div className="saved-badge">Saved</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;