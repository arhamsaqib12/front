import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

export default function Hashtag() {
  const { hashtag } = useParams(); // Get the hashtag from the URL
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({}); // Track liked posts
  const [commentClicked, setCommentClicked] = useState({}); // Track which comments are clicked

  useEffect(() => {
    const fetchPostsByHashtag = async () => {
      setError('');
      setLoading(true);
      try {
        const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/search?q=%23${encodeURIComponent(hashtag)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`,
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); // Capture the error message
          throw new Error(`Failed to fetch posts for hashtag: ${errorText}`);
        }

        const data = await response.json();
        setPosts(data.tweets || []); // Use `tweets` instead of `posts` if the API returns tweets
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByHashtag();
  }, [hashtag]);

  // Handle like/unlike
  const toggleLike = async (postId) => {
    const isLiked = likedPosts[postId];

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
        throw new Error(isLiked ? 'Failed to unlike post' : 'Failed to like post');
      }

      const updatedLikes = {
        ...likedPosts,
        [postId]: !isLiked,
      };

      setLikedPosts(updatedLikes);

      // Update localStorage
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
    } catch (error) {
      console.error(isLiked ? 'Error unliking post:' : 'Error liking post:', error);
    }
  };

  // Handle comment button click
  const handleCommentClick = (postId) => {
    setCommentClicked(prev => ({ ...prev, [postId]: !prev[postId] }));
    // Implement further action or link to comment section
  };

  if (loading) {
    return <div className="container-fluid"><div className="alert alert-info">Loading...</div></div>;
  }

  return (
    <div className="container-fluid g-0 m-0 p-0 b-0">
      <h1 className="text-white py-4">Posts for #{hashtag}</h1>

      {error && <div className="alert alert-danger">Error: {error}</div>}
      {posts.length > 0 ? (
        <ul className="p-0">
          {posts.map((post) => (
            <li key={post.id} className="border border-secondary bg-black text-white list-unstyled pb-3">
              <div className="media">
                <div className="media-body">
                  <h5 className="py-2 ps-3">
                    {post.User.profilePic && (
                      <img
                        src={post.User.profilePic}
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                      />
                    )}
                    <Link to={`/profile/${post.User.id}`} className='text-white' style={{ textDecoration: 'none' }}>
                      {post.User.name}
                    </Link>
                    <small className="text-secondary">@{post.User.email}</small>
                    <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                  </h5>
                  <h5 className="ps-3 fw-light">{post.postText}</h5>
                  {post.media && (
                    <img
                      src={post.media}
                      className="ps-5 pe-5"
                      alt="Post Media"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '20px' // Rounded corners
                      }}
                    />
                  )}
                  <div className="ps-3 pt-2 d-flex align-items-center">
                    <button
                      className={`btn btn-lg ${likedPosts[post.id] ? 'text-danger' : 'text-light'}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <i className={`bi ${likedPosts[post.id] ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i> {post.likesCount || 0}
                    </button>
                    <button
                      className={`btn btn-lg bg-black border-0 ${commentClicked[post.id] ? 'btn-primary' : 'btn-light'}`}
                      onClick={() => handleCommentClick(post.id)}
                    >
                      <i className={`bi ${commentClicked[post.id] ? 'bi-chat-fill text-primary border-1' : 'bi-chat'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No posts found for this hashtag.</p>
      )}
    </div>
  );
}
