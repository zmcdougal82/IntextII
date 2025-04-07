import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      setLoading(true);
      try {
        // Get a few movies to display on the home page
        const response = await movieService.getMovies({ page: 1, pageSize: 4 });
        setFeaturedMovies(response.movies);
      } catch (err) {
        console.error('Error fetching featured movies:', err);
        // Extract error message or use a default message
        const errorMessage = err.response?.data?.title || 
                            err.response?.data?.message || 
                            err.message || 
                            'Failed to load featured movies. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section bg-dark text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1 className="display-4 fw-bold mb-4">Find Your Next Favorite Movie</h1>
              <p className="lead mb-4">
                Discover and rate movies from our extensive collection. Get personalized recommendations based on your preferences.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/movies" variant="primary" size="lg">
                  Browse Movies
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="lg">
                  Sign Up
                </Button>
              </div>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <div className="hero-image text-center">
                <FontAwesomeIcon icon={faFilm} size="10x" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Movies Section */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Featured Movies</h2>
          <Button as={Link} to="/movies" variant="outline-primary">
            View All <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading featured movies...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <Row>
            {featuredMovies.map(movie => (
              <Col key={movie.id} xs={12} sm={6} md={3} className="mb-4">
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose Our Platform</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <FontAwesomeIcon icon={faFilm} size="3x" className="text-primary" />
                  </div>
                  <Card.Title>Extensive Collection</Card.Title>
                  <Card.Text>
                    Access thousands of movies across various genres, from classics to the latest releases.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <FontAwesomeIcon icon={faStar} size="3x" className="text-primary" />
                  </div>
                  <Card.Title>Personalized Ratings</Card.Title>
                  <Card.Text>
                    Rate movies you've watched and get recommendations based on your preferences.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <FontAwesomeIcon icon={faArrowRight} size="3x" className="text-primary" />
                  </div>
                  <Card.Title>Discover New Favorites</Card.Title>
                  <Card.Text>
                    Find hidden gems and expand your movie horizons with our curated recommendations.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="mb-5">
        <Card className="text-center p-5 bg-primary text-white">
          <Card.Body>
            <h2 className="mb-3">Ready to start your movie journey?</h2>
            <p className="lead mb-4">
              Join our community today and discover movies you'll love.
            </p>
            <Button as={Link} to="/register" variant="light" size="lg">
              Create Your Account
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
