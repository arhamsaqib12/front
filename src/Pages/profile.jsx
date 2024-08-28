import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [likedTweets, setLikedTweets] = useState({});
  const [commentClicked, setCommentClicked] = useState({});

  // Fetch user details and posts
  const fetchUserAndPosts = async () => {
    const token = localStorage.getItem('token');
    const loggedInUserId = JSON.parse(localStorage.getItem('userId')); // Get the logged-in user ID

    try {
      // Fetch user details
      const userResponse = await fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user's posts
      const postsResponse = await fetch(`https://twit-backend-production.up.railway.app/api/posts/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!postsResponse.ok) {
        throw new Error('Failed to fetch posts');
      }

      const postsData = await postsResponse.json();
      setPosts(postsData);

      // Initialize liked tweets
      initializeLikedTweets(postsData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Initialize liked tweets from localStorage
  const initializeLikedTweets = (posts) => {
    const storedLikes = JSON.parse(localStorage.getItem('likedTweets')) || {};
    const likes = {};
    posts.forEach(post => {
      likes[post.id] = storedLikes[post.id] || false;
    });
    setLikedTweets(likes);
  };

  // Handle like/unlike
  const toggleLike = async (postId) => {
    const isLiked = likedTweets[postId];
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
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
      localStorage.setItem('likedTweets', JSON.stringify(updatedLikes));
      fetchUserAndPosts(); // Refresh posts to update like count
    } catch (error) {
      console.error(isLiked ? 'Error unliking tweet:' : 'Error liking tweet:', error);
    }
  };

  // Handle comment button click
  const handleCommentClick = (postId) => {
    setCommentClicked(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  useEffect(() => {
    fetchUserAndPosts();
  }, [userId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const loggedInUserId = JSON.parse(localStorage.getItem('userId'));

  return (
    <Container className="mt-4">
      {user && (
        <Row>
          <Col md={12}>
            <Card className="border border-secondary bg-black text-white ">
              <Card.Img
                src={`${user.headerPic}`}
                alt="Header"
                className="w-100"
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="position-relative">
                <div
                  className="position-absolute"
                  style={{
                    top: '-50px',
                    left: '20px',
                    width: '100px',
                    height: '100px',
                    overflow: 'hidden',
                    borderRadius: '50%',
                    border: '2px solid white',
                  }}
                >
                  <img
                    src={`${user.profilePic}`}
                    alt="Profile"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Card.Title className="mt-5">{user.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-secondary">
                  @{user.email}
                </Card.Subtitle>
                <Card.Subtitle className=" text-white fs-5 my-3">
                  {user.bio}
                </Card.Subtitle>
                {loggedInUserId === user.id && (
                  <>
                    <Button variant="primary" className="me-2">Follow</Button>
                    <Link className="btn btn-secondary" to={`/edit/${userId}`}>
                      Edit Profile
                    </Link>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} className="mt-5"> 
            {posts.length > 0 ? (
              <ul className="p-0 w-100">
                {posts.map((post) => (
                  <li key={post.id} className="w-100 border border-secondary bg-black text-white list-unstyled ">
                    <Card className="bg-black text-white">
                      <Card.Body>
                        <h5 className="">
                          {user.name} <small className="text-secondary">@{user.email}</small>
                          <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                        </h5>
                        <p className="fw-light fs-5">{post.postText}</p>
                        {post.media && (
                          <img
                            src={`${post.media}`}
                            className="ps-5 pe-5 rounded"
                            alt="Post Media"
                            style={{ width: '100%' }}
                          />
                        )}
                        <div className="d-flex align-items-center pt-2">
                          <button
                            className={`btn btn-lg ${likedTweets[post.id] ? 'text-danger' : 'text-light'}`}
                            onClick={() => toggleLike(post.id)}
                          >
                            <i className={`bi ${likedTweets[post.id] ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i> {post.likesCount}
                          </button>
                          <button
                            className={`btn btn-lg bg-black border-0 ${commentClicked[post.id] ? 'btn-primary' : 'btn-light'}`}
                            onClick={() => handleCommentClick(post.id)}
                          >
                            <i className={`bi ${commentClicked[post.id] ? 'bi-chat-fill text-primary border-1' : 'bi-chat'}`}></i>
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No posts found.</p>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Profile;
