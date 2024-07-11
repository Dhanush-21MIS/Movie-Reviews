import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, setRating, isInteractive = true }) => {
  const starValues = [1, 2, 3, 4, 5]; // Point values corresponding to each star

  const handleStarClick = (index) => {
    if (isInteractive) {
      setRating(starValues[index]); // Set rating based on point value
    }
  };

  const getStarClass = (index) => {
    const value = starValues[index];
    if (value <= rating) {
      return 'star filled';
    } else if (value - 0.5 <= rating) {
      return 'star half-filled';
    } else {
      return 'star';
    }
  };

  return (
    <div className="star-rating">
      {starValues.map((value, index) => (
        <span
          key={index}
          className={getStarClass(index)}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
