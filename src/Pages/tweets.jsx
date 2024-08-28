import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedTweets, setLikedTweets] = useState({}); // Track liked tweets
  const [commentClicked, setCommentClicked] = useState({}); // Track which comments are clicked

  // Fetch tweets
  const fetchTweets = async () => {
    try {
      const response = await fetch('https://twit-backend-production.up.railway.app/api/posts', {
        method: 'GET',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching tweets: ${response.status}`);
      }

      const data = await response.json();
      setTweets(data);
      fetchUsers(data);
      initializeLikedTweets(data); // Initialize liked tweets
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async (tweets) => {
    const userIds = [...new Set(tweets.map(tweet => tweet.userId))];
    userIds.forEach(async (userId) => {
      if (!users[userId]) {
        try {
          const userResponse = await fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `${localStorage.getItem('token')}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });
  };

  // Initialize liked tweets from localStorage
  const initializeLikedTweets = (tweets) => {
    const storedLikes = JSON.parse(localStorage.getItem('likedTweets')) || {};
    const likes = {};
    tweets.forEach(tweet => {
      likes[tweet.id] = storedLikes[tweet.id] || false;
    });
    setLikedTweets(likes);
  };

  // Handle like/unlike
  const toggleLike = async (postId) => {
    const isLiked = likedTweets[postId];

    try {
      const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error(isLiked ? 'Failed to unlike tweet' : 'Failed to like tweet');
      }

      const updatedLikes = {
        ...likedTweets,
        [postId]: !isLiked,
      };

      setLikedTweets(updatedLikes);

      // Update localStorage
      localStorage.setItem('likedTweets', JSON.stringify(updatedLikes));

      // Refresh tweets to update like count
      fetchTweets();
    } catch (error) {
      console.error(isLiked ? 'Error unliking tweet:' : 'Error liking tweet:', error);
    }
  };

  // Handle comment button click
  const handleCommentClick = (postId) => {
    // Toggle comment button color on click
    setCommentClicked(prev => ({ ...prev, [postId]: !prev[postId] }));
    // Implement further action or link to comment section
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  if (loading) {
    return <div className="container-fluid"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <div className="container-fluid g-0 m-0 p-0 b-0">
      {error && <div className="alert alert-danger">Error: {error}</div>}
      <ul className="p-0">
        {tweets.map((tweet) => (
          <li key={tweet.id} className="border border-secondary bg-black text-white list-unstyled pb-3">
            <div className="media">
              <div className="media-body">
                {users[tweet.userId] && (
                  <span>
                    <h5 className="py-2 ps-3">
                      <img
                        src={users[tweet.userId].profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                      />
                      <Link to={`/profile/${users[tweet.userId].id}`}
                      style={{textDecoration:"none"}}
                      className='text-white'
                      > {users[tweet.userId].name} </Link>
                      <small className="text-secondary">@{users[tweet.userId].email}</small>
                      <small className="text-muted">{new Date(tweet.createdAt).toLocaleString()}</small>
                    </h5>
                  </span>
                )}
                <h5 className="ps-3 fw-light">{tweet.postText}</h5>
                {tweet.media && (
                  <img
                    src={tweet.media}
                    className="ps-5 pe-5"
                    alt="Tweet Media"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '20px' // Rounded corners
                    }}
                  />
                )}
                <div className="ps-3 pt-2 d-flex align-items-center">
                  <button
                    className={`btn btn-lg ${likedTweets[tweet.id] ? 'text-danger' : 'text-light'}`}
                    onClick={() => toggleLike(tweet.id)}
                  >
                    <i className={`bi ${likedTweets[tweet.id] ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i> {tweet.likesCount}
                  </button>
                  <Link to={`/tweet/${tweet.id}`}>
                  <button
                    className={`btn btn-lg  bg-black text-white border-0 ${commentClicked[tweet.id] ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => handleCommentClick(tweet.id)}
                  >
                    <i className={`bi ${commentClicked[tweet.id] ? 'bi-chat-fill text-primary border-1' : 'bi-chat'}`}>
                    </i>
                  </button>
                    </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tweets;
