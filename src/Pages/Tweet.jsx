import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import Comment from './comment'; // Import the Comment component

const SingleTweet = () => {
  const { tweetId } = useParams(); // Get tweetId from URL parameters
  const [tweet, setTweet] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        console.log(`Fetching tweet with ID: ${tweetId}`); // Log tweetId
        const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/tweet/${tweetId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`, // Add Bearer prefix
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching tweet: ${response.status}`);
        }

        const data = await response.json();
        setTweet(data);
        fetchUser(data.userId); // Fetch the user data based on tweet's userId
      } catch (error) {
        console.error('Error fetching tweet:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async (userId) => {
      try {
        console.log(`Fetching user with ID: ${userId}`); // Log userId
        const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${localStorage.getItem('token')}`, // Add Bearer prefix
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error(`Error fetching user: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      }
    };

    fetchTweet();
  }, [tweetId]);

  if (loading) {
    return <div className="container-fluid"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger">Error: {error}</div>}
      {tweet && user && (
        <div className="border border-secondary bg-black text-white p-3">
          <div className="media">
            <div className="media-body">
              <h5 className="py-2">
                <span>{user.name}</span>
                <small className="text-secondary">@{user.email}</small>
                <small className="text-muted">{new Date(tweet.createdAt).toLocaleString()}</small>
              </h5>
              <p>{tweet.postText}</p>
              {tweet.media && (
                <img
                  src={tweet.media}
                  className="img-fluid"
                  alt="Tweet Media"
                  style={{ borderRadius: '20px' }}
                />
              )}
              <div className="pt-2">
                <button className="btn btn-lg text-light">
                  <i className="bi bi-heart"></i> {tweet.likesCount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Comment Section */}
      {tweet && <Comment postId={tweetId} />} {/* Pass tweetId as postId */}
    </div>
  );
};

export default SingleTweet;
