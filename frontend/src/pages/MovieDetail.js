import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCalendarAlt, 
  faClock, 
  faGlobe, 
  faUser, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import movieService from '../services/movieService';
import ratingService from '../services/ratingService';
import StarRating from '../components/StarRating';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ratingError, setRatingError] = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  
  // Default image if no poster is available
  const defaultImage = 'https://via.placeholder.com/500x750?text=No+Image+Available';
  
  // Generate a random image based on movie title for demo purposes
  // In a real app, you would use actual movie posters
  const getImageUrl = () => {
    if (!movie) return defaultImage;
    const seed = movie.id || movie.title;
    return `https://picsum.photos/seed/${seed}/500/750`;
  };
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await movieService.getMovie(id);
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        // Extract error message or use a default message
        const errorMessage = err.response?.data?.title || 
                            err.response?.data?.message || 
                            err.message || 
                            'Failed to load movie details. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);
  
  // Fetch user's rating for this movie if authenticated
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!isAuthenticated()) return;
      
      setRatingLoading(true);
      
      try {
        const rating = await ratingService.getRating(id);
        setUserRating(rating.value);
      } catch (err) {
        // If 404, user hasn't rated this movie yet
        if (err.response && err.response.status === 404) {
          setUserRating(0);
        } else {
          console.error('Error fetching user rating:', err);
        }
      } finally {
        setRatingLoading(false);
      }
    };
    
    fetchUserRating();
  }, [id, isAuthenticated]);
  
  // Handle rating change
  const handleRatingChange = async (rating) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/movies/${id}` } });
      return;
    }
    
    setRatingLoading(true);
    setRatingError(null);
    setRatingSuccess(false);
    
    try {
      if (userRating) {
        // Update existing rating
        await ratingService.updateRating(id, { value: rating });
      } else {
        // Create new rating
        await ratingService.createRating({ movieId: id, value: rating });
      }
      
      setUserRating(rating);
      setRatingSuccess(true);
      
      // Refresh movie to update average rating
      const updatedMovie = await movieService.getMovie(id);
      setMovie(updatedMovie);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setRatingSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving rating:', err);
      // Extract error message or use a default message
      const errorMessage = err.response?.data?.title || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to save your rating. Please try again.';
      setRatingError(errorMessage);
    } finally {
      setRatingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading movie details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button 
          variant="outline-primary" 
          onClick={() => navigate(-1)}
          className="mt-3"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!movie) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Movie not found.</Alert>
        <Button 
          variant="outline-primary" 
          onClick={() => navigate('/movies')}
          className="mt-3"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Movies
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back
      </Button>
      
      <Row>
        <Col md={4} className="mb-4 mb-md-0">
          <Card className="border-0 shadow-sm">
            <Card.Img 
              variant="top" 
              src={getImageUrl()} 
              alt={movie.title}
              onError={(e) => { e.target.src = defaultImage; }}
              className="movie-poster"
            />
          </Card>
        </Col>
        
        <Col md={8}>
          <h1 className="mb-3">{movie.title}</h1>
          
          <div className="d-flex flex-wrap align-items-center mb-3">
            {movie.releaseYear && (
              <div className="me-3 mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1 text-muted" />
                <span>{movie.releaseYear}</span>
              </div>
            )}
            
            {movie.duration && (
              <div className="me-3 mb-2">
                <FontAwesomeIcon icon={faClock} className="me-1 text-muted" />
                <span>{movie.duration}</span>
              </div>
            )}
            
            {movie.rating && (
              <div className="me-3 mb-2">
                <Badge bg="secondary">{movie.rating}</Badge>
              </div>
            )}
            
            {movie.averageRating !== null && movie.averageRating !== undefined && (
              <div className="mb-2">
                <FontAwesomeIcon icon={faStar} className="me-1 text-warning" />
                <span>{movie.averageRating.toFixed(1)} average rating</span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            {movie.genres && movie.genres.map((genre, index) => (
              <Badge 
                bg="primary" 
                className="me-2 mb-2" 
                key={index}
              >
                {genre}
              </Badge>
            ))}
          </div>
          
          {movie.description && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Overview</Card.Title>
                <Card.Text>{movie.description}</Card.Text>
              </Card.Body>
            </Card>
          )}
          
          <Row className="mb-4">
            {movie.director && (
              <Col sm={6} className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faUser} className="me-2 text-muted" />
                  Director
                </h5>
                <p>{movie.director}</p>
              </Col>
            )}
            
            {movie.country && (
              <Col sm={6} className="mb-3">
                <h5>
                  <FontAwesomeIcon icon={faGlobe} className="me-2 text-muted" />
                  Country
                </h5>
                <p>{movie.country}</p>
              </Col>
            )}
          </Row>
          
          {movie.cast && (
            <div className="mb-4">
              <h5>Cast</h5>
              <p>{movie.cast}</p>
            </div>
          )}
          
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Rate This Movie</Card.Title>
              
              {ratingError && (
                <Alert variant="danger" className="mb-3">
                  {ratingError}
                </Alert>
              )}
              
              {ratingSuccess && (
                <Alert variant="success" className="mb-3">
                  Your rating has been saved!
                </Alert>
              )}
              
              <div className="d-flex align-items-center">
                <StarRating 
                  initialRating={userRating || 0}
                  onRatingChange={handleRatingChange}
                  disabled={ratingLoading || !isAuthenticated()}
                />
                
                {ratingLoading && (
                  <Spinner 
                    animation="border" 
                    size="sm" 
                    className="ms-3"
                  />
                )}
                
                {!isAuthenticated() && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="ms-3"
                    onClick={() => navigate('/login', { state: { from: `/movies/${id}` } })}
                  >
                    Login to Rate
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetail;
