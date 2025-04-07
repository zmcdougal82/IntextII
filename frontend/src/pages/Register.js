import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    zip: '',
    netflix: false,
    amazonPrime: false,
    disneyPlus: false,
    paramountPlus: false,
    max: false,
    hulu: false,
    appleTVPlus: false,
    peacock: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showStreamingServices, setShowStreamingServices] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 1)) {
      newErrors.age = 'Please enter a valid age';
    }
    
    if (formData.zip && (isNaN(formData.zip) || formData.zip.length < 5)) {
      newErrors.zip = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...registerData } = formData;
      
      await register(registerData);
      navigate('/');
    } catch (err) {
      // Handle the error response properly
      const errorMessage = 
        typeof err.response?.data === 'string' 
          ? err.response.data 
          : err.response?.data?.title || err.response?.data?.message || 'Registration failed. Please try again later.';
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-primary mb-3" />
                <h2>Create an Account</h2>
                <p className="text-muted">Join our community to rate and discover movies</p>
              </div>

              {apiError && (
                <Alert variant="danger" className="mb-4">
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Basic Information */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="age">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            placeholder="Your age"
                            value={formData.age}
                            onChange={handleChange}
                            isInvalid={!!errors.age}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.age}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="gender">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                
                {/* Optional Information */}
                <div className="mb-3">
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => setShowStreamingServices(!showStreamingServices)}
                    type="button"
                  >
                    {showStreamingServices ? 'Hide' : 'Show'} Additional Information
                  </Button>
                </div>
                
                {showStreamingServices && (
                  <>
                    <h5 className="mt-4 mb-3">Location Information</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="city">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder="Your city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="state">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            placeholder="Your state"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="zip">
                          <Form.Label>ZIP Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="zip"
                            placeholder="Your ZIP code"
                            value={formData.zip}
                            onChange={handleChange}
                            isInvalid={!!errors.zip}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.zip}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h5 className="mt-4 mb-3">Streaming Services</h5>
                    <p className="text-muted mb-3">Select the streaming services you currently subscribe to:</p>
                    
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="netflix">
                          <Form.Check
                            type="checkbox"
                            label="Netflix"
                            name="netflix"
                            checked={formData.netflix}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="amazonPrime">
                          <Form.Check
                            type="checkbox"
                            label="Amazon Prime"
                            name="amazonPrime"
                            checked={formData.amazonPrime}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="disneyPlus">
                          <Form.Check
                            type="checkbox"
                            label="Disney+"
                            name="disneyPlus"
                            checked={formData.disneyPlus}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="paramountPlus">
                          <Form.Check
                            type="checkbox"
                            label="Paramount+"
                            name="paramountPlus"
                            checked={formData.paramountPlus}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="max">
                          <Form.Check
                            type="checkbox"
                            label="Max"
                            name="max"
                            checked={formData.max}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="hulu">
                          <Form.Check
                            type="checkbox"
                            label="Hulu"
                            name="hulu"
                            checked={formData.hulu}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="appleTVPlus">
                          <Form.Check
                            type="checkbox"
                            label="Apple TV+"
                            name="appleTVPlus"
                            checked={formData.appleTVPlus}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="peacock">
                          <Form.Check
                            type="checkbox"
                            label="Peacock"
                            name="peacock"
                            checked={formData.peacock}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Register
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Login here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
