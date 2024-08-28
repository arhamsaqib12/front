import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://twit-backend-production.up.railway.app/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { token, user } = response.data; // Destructure the response data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id); // Save userId in local storage

      alert('Login successful');
      navigate('/home');
      handleClose();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || err.response.data);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal " data-bs-theme="dark">
      <div className="p-5 bg-black">
        <Modal.Header closeButton>
          <Modal.Title className="fs-2">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Control 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Your Email" 
                required 
                className="form-control py-3  text-white bg-dark"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
                className="form-control py-3  text-white  bg-dark"

              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default Login;
