import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Explore() {
  const location = useLocation();
  const initialSearchQuery = location.state?.searchQuery || '';

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [userFetch, setUserFetch] = useState({});
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setError(null);
    try {
      // Fetch tweets and users
      const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/search?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTweets(data.tweets || []);
        setUsers(data.users || []);
        fetchUserDetails(data.tweets); // Fetch user details separately
      } else {
        setError('No results found.');
        setTweets([]);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
      setTweets([]);
      setUsers([]);
    }
  };

  const fetchUserDetails = async (tweets) => {
    const userIds = [...new Set(tweets.map(tweet => tweet.userId))]; // Get unique user IDs
    const userPromises = userIds.map(async (userId) => {
      try {
        const userResponse = await fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          return { [userId]: userData }; // Return user data as an object
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      return null;
    });

    const usersData = await Promise.all(userPromises);
    const usersMap = usersData.reduce((acc, user) => ({ ...acc, ...user }), {});
    setUserFetch(usersMap); // Set users as an object for efficient lookup
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  return (
    <div className="container-fluid bg-black g-0 w-100">
      <div className="row g-0">
        <div className="col-12">
          <form onSubmit={handleSearchSubmit} className="d-flex">
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

          <h3>Search Results:</h3>
          <div className="results">
            {error && <p className="text-danger">{error}</p>}
            
            {users.length > 0 && (
              <>
                <h4>Users:</h4>
                {users.map((user) => (
                  <div key={user.id} className="result-item border border-secondary bg-black text-white p-3 mb-3">
                    <h5>{user.name}</h5>
                    <p className="text-secondary">@{user.email}</p>
                    {user.profilePic && (
                      <img
                        src={`https://twit-backend-production.up.railway.app/public/${user.profilePic}`}
                        className="img-fluid rounded-circle"
                        alt={`${user.name}'s profile`}
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            {tweets.length > 0 && (
              <>
                <h4>Tweets:</h4>
                {tweets.map((tweet) => (
                  <div key={tweet.id} className="result-item border border-secondary bg-black text-white p-3 mb-3">
                    {userFetch[tweet.userId] && (
                      <div>
                        <h5>{userFetch[tweet.userId].name}</h5>
                        <p className="text-secondary">@{userFetch[tweet.userId].email}</p>
                      </div>
                    )}
                    <p>{tweet.postText}</p>
                    {tweet.media && (
                      <img
                        src={`${tweet.media}`}
                        className="img-fluid rounded mt-2"
                        alt="Tweet Media"
                      />
                    )}
                  </div>
                ))}
              </>
            )}

            {tweets.length === 0 && users.length === 0 && (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
