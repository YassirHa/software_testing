import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const fetchDataWithRateLimit = async () => {
      const itemIds = Array.from({ length: 20 }, (_, index) => index + 1);

      const maxConcurrentRequests = 5;

      const itemPromises = itemIds.map(async (itemId, index) => {
        if (index % maxConcurrentRequests === 0) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }

        try {
          const response = await fetch(`https://api.jikan.moe/v4/anime/${itemId}`);
          const data = await response.json();
          if (data.data && data.data.mal_id) {
            const itemData = {
              id: data.data.mal_id,
              title: data.data.title,
              status: '',
              imageUrl: data.data.images.jpg,
              score: 'None',
              episodes: data.data.episodes,
            };
            return itemData;
          }
        } catch (error) {
          console.error('Error fetching data for item', itemId, error);
        }
        return null;
      });

      const itemData = (await Promise.all(itemPromises)).filter((item) => item !== null);
      setItems(itemData);
      setLoading(false);
    };

    fetchDataWithRateLimit();
  }, []);

  return (
    <div>
      <div className="banner banner-image"></div>

      <div className="menu">
        <button onClick={() => handleFilterChange('All')}>All</button>
        <button onClick={() => handleFilterChange('Current')}>Current</button>
        <button onClick={() => handleFilterChange('Completed')}>Completed</button>
        <button onClick={() => handleFilterChange('Paused')}>Paused</button>
        <button onClick={() => handleFilterChange('Dropped')}>Dropped</button>
        <button onClick={() => handleFilterChange('Planned')}>Planned</button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <ul className="list">
          {items.map((item) => {
            if (filter === 'All' || filter === item.status) {
              const backgroundStyle = {
                backgroundImage: `url(${item.imageUrl.image_url})`,
              };

              return (
                <div>
                <li key={item.id} className="list-item" style={backgroundStyle}>
                 <div className="text">
                    <p className="title">{item.title}</p>
                    <p className="score">{item.score}</p>
                    <p className="episodes">{`${item.episodes}Ep`}</p>
                  </div> 
                </li>
                </div>
              );
            }
            return null;
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
