// AnimeList.js

import React, { useState, useEffect, useRef } from 'react';
import './AnimeList.css';

function AnimeList() {
  const [savedAnime, setSavedAnime] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveToLocalStorage = (item) => {
    const isAlreadySaved = savedAnime.some((savedItem) => savedItem.mal_id === item.mal_id);

    if (!isAlreadySaved) {
      const updatedAnime = [...savedAnime, item];
      setSavedAnime(updatedAnime);

      localStorage.setItem('SavedAnime', JSON.stringify(updatedAnime));

      console.log(`Saved "${item.title}" to local storage.`);
    } else {
      // Ask for confirmation before removing
      const shouldRemove = window.confirm(`Are you sure you want to remove "${item.title}" from local storage?`);

      if (shouldRemove) {
        const updatedAnimeList = savedAnime.filter((savedItem) => savedItem.mal_id !== item.mal_id);
        setSavedAnime(updatedAnimeList);

        localStorage.setItem('SavedAnime', JSON.stringify(updatedAnimeList));

        console.log(`Removed "${item.title}" from local storage.`);
      }
    }
  };

  const handleDropdownChange = (e, item) => {
    const selectedOption = e.target.value;

    // Update the status of the anime item in local state
    const updatedAnimeList = savedAnime.map((anime) =>
      anime.mal_id === item.mal_id ? { ...anime, status: selectedOption } : anime
    );

    setSavedAnime(updatedAnimeList);

    // Update the status in local storage
    localStorage.setItem('SavedAnime', JSON.stringify(updatedAnimeList));

    console.log(`Changed status to "${selectedOption}" for anime "${item.title}"`);
  };



  useEffect(() => {
    const savedAnimeData = JSON.parse(localStorage.getItem('SavedAnime')) || [];
    setSavedAnime(savedAnimeData);
  }, []);

  return (
    <div className="SavedListPage">
      <div className="Banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <h1>Welcome to Your Anime List</h1>
        <p>Keep track of your favorite anime here!</p>
        <button className="top-right-button" onClick={handleButtonClick}></button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>
      <div className="menu">
        <button onClick={() => setFilterStatus('☰')}>☰</button>
        <button onClick={() => setFilterStatus('All')}>All</button>
        <button onClick={() => setFilterStatus('Current')}>Current</button>
        <button onClick={() => setFilterStatus('Completed')}>Completed</button>
        <button onClick={() => setFilterStatus('Paused')}>Paused</button>
        <button onClick={() => setFilterStatus('Dropped')}>Dropped</button>
        <button onClick={() => setFilterStatus('Planned')}>Planned</button>
      </div>
      <h1>Saved Anime List</h1>

      <div className="saved-anime-list">
        {savedAnime
          .filter((item) => filterStatus === 'All' || item.status === filterStatus) // Apply the filter
          .map((item, index) => (
            <div
              key={index}
              className="saved-anime-item"
              style={{ backgroundImage: `url(${item.images.jpg.large_image_url || ''})` }}
            >
              <h2 className="title">{item.title}</h2>
              <p className="episodes">Episodes: {item.episodes}</p>

              <button className="bottom-left-button" onClick={() => handleSaveToLocalStorage(item)}>
                Save
              </button>
              <select className="dropdown" onChange={(e) => handleDropdownChange(e, item)}>
                <option value="All">All</option>
                <option value="Current">Current</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
                <option value="Dropped">Dropped</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AnimeList;
