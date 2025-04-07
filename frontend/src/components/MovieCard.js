import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const MovieCard = ({ movie }) => {
  // Default image if no poster is available
  const defaultImage = 'https://via.placeholder.com/300x450?text=No+Image+Available';
  
  // Generate a random image based on movie title for demo purposes
  // In a real app, you would use actual movie posters
  const getImageUrl = () => {
    const seed = movie.id || movie.title;
    return `https://picsum.photos/seed/${seed}/300/450`;
  };

  return (
    <Card className="h-100 movie-card">
      <Link to={`/movies/${movie.id}`} className="text-decoration-none">
        <Card.Img 
          variant="top" 
          src={getImageUrl()} 
          alt={movie.title}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <Card.Body>
          <Card.Title className="text-truncate">{movie.title}</Card.Title>
          <div className="mb-2">
            {movie.genres && movie.genres.slice(0, 3).map((genre, index) => (
              <Badge bg="secondary" className="me-1 mb-1" key={index}>
                {genre}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            {movie.releaseYear && (
              <small className="text-muted">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                {movie.releaseYear}
              </small>
            )}
            {movie.duration && (
              <small className="text-muted">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                {movie.duration}
              </small>
            )}
          </div>
          {movie.averageRating !== null && movie.averageRating !== undefined && (
            <div className="mt-2">
              <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
              <span>{movie.averageRating.toFixed(1)}</span>
            </div>
          )}
        </Card.Body>
      </Link>
    </Card>
  );
};

export default MovieCard;
