import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
 // Make sure to import the CSS file

const SignupModal = ({ show, handleClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://twit-backend-production.up.railway.app/api/auth/signup', 
        { name, email, password, dateOfBirth: `${year}-${month}-${day}` },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Signup successful');
      handleClose();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="custom-modal" data-bs-theme="dark" > 
      <div className="p-5 bg-black">

      <Modal.Header closeButton>
        <Modal.Title   className="fs-2 text-white">Create your account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Control 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Name"
              required 
              className="form-control py-3"
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email"
              required 
              className="form-control py-3"
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              required 
              className="form-control py-3 "
            />
          </Form.Group>
          <Form.Group controlId="formDateOfBirth" className="mb-3">
            <Form.Label className='text-white'>Date of birth</Form.Label>
            <Row>
              <Col>
                <Form.Control 
                  as="select" 
                  value={month} 
                  onChange={(e) => setMonth(e.target.value)} 
                  required 
                  className="form-control"
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <Form.Control 
                  as="select" 
                  value={day} 
                  onChange={(e) => setDay(e.target.value)} 
                  required 
                  className="form-control"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <Form.Control 
                  as="select" 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)} 
                  required 
                  className="form-control"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 120 }, (_, i) => (
                    <option key={2023 - i} value={2023 - i}>{2023 - i}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Next
          </Button>
        </Form>
      </Modal.Body>
      </div>
    </Modal>
  );
};

export default SignupModal;
