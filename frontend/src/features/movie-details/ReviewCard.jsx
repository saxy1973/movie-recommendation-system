import "./details.css";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">

      <div className="review-top">

        <div className="review-user">

          <div className="review-avatar">
            👤
          </div>

          <div>
            <h3>{review.name}</h3>
            <p className="verified">
              ✔ Verified Viewer
            </p>
          </div>

        </div>

        <div className="review-rating">

          <span>{"★".repeat(review.rating)}</span>

          <p>{review.time}</p>

        </div>

      </div>

      <p className="review-message">
        {review.comment}
      </p>

      <div className="review-footer">

        <button>👍 Helpful ({review.helpful})</button>

      </div>

    </div>
  );
};

export default ReviewCard;