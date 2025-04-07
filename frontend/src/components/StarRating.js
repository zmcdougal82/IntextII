import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ initialRating = 0, totalStars = 5, onRatingChange, disabled = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (selectedRating) => {
    if (disabled) return;
    
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${disabled ? 'disabled' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(0)}
            style={{ cursor: disabled ? 'default' : 'pointer', fontSize: '1.5rem', padding: '0 0.25rem' }}
          >
            <FontAwesomeIcon
              icon={(hover || rating) >= starValue ? solidStar : regularStar}
              className={(hover || rating) >= starValue ? 'text-warning' : 'text-muted'}
            />
          </span>
        );
      })}
      {rating > 0 && !disabled && (
        <span className="ms-2 rating-value">({rating})</span>
      )}
    </div>
  );
};

export default StarRating;
