import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reviews.css'; // Make sure to import the CSS file if you're using an external stylesheet
import StarRating from './StarRating';

const Reviews = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/reviews/${movieId}`);
        setReviews(response.data);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
        setError('Failed to fetch reviews');
      }
    };

    fetchReviews();
  }, [movieId]);

  return (
    <div className="reviews-container">
      <h2>User Reviews</h2>
      {error && <p>{error}</p>}
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review._id} className="review">
            <h4>@user {review.username}</h4>
            <p><StarRating rating={review.rating} /></p>
            <p>{review.reviewText}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to write a review!</p>
      )}
    </div>
  );
};

export default Reviews;
