import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ratingService from '../services/ratingService';
import StarRating from '../components/StarRating';

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  
  // Fetch user ratings
  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await ratingService.getUserRatings();
        setRatings(response.ratings || []);
      } catch (err) {
        console.error('Error fetching user ratings:', err);
        // Extract error message or use a default message
        const errorMessage = err.response?.data?.title || 
                            err.response?.data?.message || 
                            err.message || 
                            'Failed to load your ratings. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatings();
  }, []);
  
  // Handle rating update
  const handleRatingUpdate = async (movieId, newRating) => {
    setUpdateLoading(prev => ({ ...prev, [movieId]: true }));
    
    try {
      await ratingService.updateRating(movieId, { value: newRating });
      
      // Update local state
      setRatings(prevRatings => 
        prevRatings.map(rating => 
          rating.movieId === movieId 
            ? { ...rating, value: newRating } 
            : rating
        )
      );
    } catch (err) {
      console.error('Error updating rating:', err);
      // Extract error message or use a default message
      const errorMessage = err.response?.data?.title || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to update rating. Please try again.';
      setError(errorMessage);
    } finally {
      setUpdateLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };
  
  // Handle rating deletion
  const handleRatingDelete = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }
    
    setDeleteLoading(prev => ({ ...prev, [movieId]: true }));
    
    try {
      await ratingService.deleteRating(movieId);
      
      // Update local state
      setRatings(prevRatings => 
        prevRatings.filter(rating => rating.movieId !== movieId)
      );
    } catch (err) {
      console.error('Error deleting rating:', err);
      // Extract error message or use a default message
      const errorMessage = err.response?.data?.title || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to delete rating. Please try again.';
      setError(errorMessage);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };
  
  // Default image if no poster is available
  const defaultImage = 'https://via.placeholder.com/300x450?text=No+Image+Available';
  
  // Generate a random image based on movie title for demo purposes
  const getImageUrl = (movieId, movieTitle) => {
    const seed = movieId || movieTitle;
    return `https://picsum.photos/seed/${seed}/300/450`;
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your ratings...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">My Ratings</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {ratings.length === 0 ? (
        <Alert variant="info">
          <p>You haven't rated any movies yet.</p>
          <Link to="/movies" className="btn btn-primary mt-2">
            Browse Movies
          </Link>
        </Alert>
      ) : (
        <>
          <p className="text-muted mb-4">
            You have rated {ratings.length} movie{ratings.length !== 1 ? 's' : ''}.
          </p>
          
          <Row>
            {ratings.map(rating => (
              <Col key={rating.movieId} xs={12} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Row className="g-0">
                    <Col xs={4}>
                      <Link to={`/movies/${rating.movieId}`}>
                        <Card.Img 
                          src={getImageUrl(rating.movieId, rating.movieTitle)}
                          alt={rating.movieTitle}
                          onError={(e) => { e.target.src = defaultImage; }}
                          className="h-100 object-fit-cover"
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Link 
                          to={`/movies/${rating.movieId}`}
                          className="text-decoration-none"
                        >
                          <Card.Title className="text-truncate">
                            {rating.movieTitle}
                          </Card.Title>
                        </Link>
                        
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Your Rating:</small>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRatingDelete(rating.movieId)}
                              disabled={deleteLoading[rating.movieId]}
                              title="Delete Rating"
                            >
                              {deleteLoading[rating.movieId] ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <FontAwesomeIcon icon={faTrashAlt} />
                              )}
                            </Button>
                          </div>
                          
                          <StarRating
                            initialRating={rating.value}
                            onRatingChange={(newRating) => 
                              handleRatingUpdate(rating.movieId, newRating)
                            }
                            disabled={updateLoading[rating.movieId]}
                          />
                          
                          {updateLoading[rating.movieId] && (
                            <div className="text-center mt-2">
                              <Spinner animation="border" size="sm" />
                              <small className="ms-2">Updating...</small>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default UserRatings;
