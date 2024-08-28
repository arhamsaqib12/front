import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch trending hashtags
  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const response = await fetch('https://twit-backend-production.up.railway.app/api/hashtag/trending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`, // Added Bearer prefix
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); // Capture the error message
          throw new Error(`Failed to fetch trending hashtags: ${errorText}`);
        }

        const data = await response.json();
        setTrendingHashtags(data.trendingHashtags || []); // Default to empty array
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
      }
    };

    fetchTrendingHashtags();
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/explore', { state: { searchQuery } });
  };

  const handleHashtagClick = (hashtag) => {
    navigate(`/hashtag/${hashtag}`);
  };

  return (
    <div className="container-fluid sticky-top p-0 m-0 g-0">
      <div className="row g-0">
        <div className="col-12">
          <form onSubmit={handleSubmit} className="d-flex">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              className="px-4 py-2 my-2 rounded-pill border-primary bg-black text-white flex-grow-1"
            />
            <button type="submit" className="btn btn-primary rounded-pill mx-2 my-2 d-flex align-items-center">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
        <div className="col-10 m-auto">
          <div className="card mt-3 bg-black border border-secondary">
            <div className="card-header border border-secondary text-white fs-4 fw-bold">
              Trending Hashtags
            </div>
            <ul className="list-group list-group-flush">
              {error && <li className="list-group-item text-danger">Error: {error}</li>}
              {trendingHashtags.length > 0 ? (
                trendingHashtags.map((hashtag, index) => (
                  <li key={index} className="list-group-item border border-secondary text-white bg-black py-2">
                    <span className='text-secondary'>{index + 1 + "."} <span className='text-secondary'>Trending</span></span>
                    <div className='fs-5 fw-bolder' onClick={() => handleHashtagClick(hashtag.text)} style={{ cursor: 'pointer' }}>
                      #{hashtag.text}
                    </div>
                    <span className="text-secondary">{hashtag.count + " posts"}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No trending hashtags found</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
