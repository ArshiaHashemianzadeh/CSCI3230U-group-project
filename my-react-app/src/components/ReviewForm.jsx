import { useState } from 'react';

function getReviews() {
  try {
    return JSON.parse(localStorage.getItem('muzic-reviews')) || {};
  } catch {
    return {};
  }
}

export default function ReviewForm({ songId }) {
  const savedReview = getReviews()[songId];

  const [rating, setRating] = useState(
    savedReview?.rating?.toString() || ''
  );
  const [review, setReview] = useState(
    savedReview?.review || ''
  );
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const allReviews = getReviews();

    allReviews[songId] = {
      rating: Number(rating),
      review: review.trim()
    };

    try {
      localStorage.setItem(
        'muzic-reviews',
        JSON.stringify(allReviews)
      );

      setMessage('Your review was saved!');
    } catch {
      setMessage('Could not save your review.');
    }
  }

  return (
    <section className="review-section">
      <h2>Rate this song</h2>

      <form className="review-form" onSubmit={handleSubmit}>
        <label htmlFor="song-rating">Your rating</label>

        <select
          id="song-rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          required
        >
          <option value="">Choose a rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very good</option>
          <option value="5">5 - Excellent</option>
        </select>

        <label htmlFor="song-review">Your review</label>

        <textarea
          id="song-review"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          placeholder="What do you think about this song?"
          maxLength={300}
          rows={4}
        />

        <button type="submit" className="button">
          Save review
        </button>

        <p role="status">{message}</p>
      </form>
    </section>
  );
}
