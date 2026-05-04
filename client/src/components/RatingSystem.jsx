const RatingSystem = ({ averageRating = 0, totalRatings = 0, onRate, canRate = false, userRating = 0 }) => {
  return (
    <section className="rating-panel">
      <div className="rating-summary">
        <strong>{averageRating.toFixed(1)}</strong>
        <span>{totalRatings} rating{totalRatings === 1 ? '' : 's'}</span>
      </div>
      <div className="star-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${star <= userRating ? 'active' : ''}`}
            onClick={() => canRate && onRate?.(star)}
            disabled={!canRate}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </section>
  );
};

export default RatingSystem;
