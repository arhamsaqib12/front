import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function EditModal({ show, handleClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    profilePic: '',
    headerPic: '',
    bio: ''
  });

  const userId = localStorage.getItem('userId'); // Get user ID from local storage

  useEffect(() => {
    if (userId) {
      fetch(`https://twit-backend-production.up.railway.app/api/posts/user/${userId}`, {
        headers: { 'Authorization': `${localStorage.getItem('token')}` },
      })
        .then(response => response.json())
        .then(data => {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            dateOfBirth: data.dateOfBirth || '',
            profilePic: data.profilePic || '',
            headerPic: data.headerPic || '',
            bio: data.bio || ''
          });
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSave = () => {
    const updatedData = {
      name: formData.name,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      bio: formData.bio,
      profilePic: formData.profilePic,
      headerPic: formData.headerPic
    };

    fetch(`http://localhost:5000/api/posts/user/edit/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          handleClose();
          navigate(`/profile/${userId}`);
        } else {
          console.error('Error updating profile:', response);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formProfilePic">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="profilePic"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formHeaderPic">
            <Form.Label>Header Picture</Form.Label>
            <Form.Control
              type="file"
              name="headerPic"
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditModal;
