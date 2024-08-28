import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Image, Row, Col } from 'react-bootstrap';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://twit-backend-production.up.railway.app/api/posts/comments/${postId}`, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://twit-backend-production.up.railway.app/api/posts/comments', {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment, userId, twitterId: postId }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setNewComment('');
      // Fetch comments again to include the new one
      const updatedCommentsResponse = await fetch(`https://twit-backend-production.up.railway.app/api/posts/comments/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!updatedCommentsResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(updatedCommentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Container data-bs-theme="dark">
      <h3>Comments</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
        </Form.Group>
        <Button type="submit" className='my-3' variant="primary">Submit</Button>
      </Form>
      <ListGroup className="mt-3">
        {comments.map((comment) => (
          <ListGroup.Item key={comment.id} className="d-flex align-items-start">
            <Image src={comment.user.profilePic} roundedCircle className="me-3" width={45} height={45} />
            <div>
              <strong>{comment.user.name} <span className="text-muted">@{comment.user.username}</span></strong>
    
              <div>{comment.content}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Comment;
