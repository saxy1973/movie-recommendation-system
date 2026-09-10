import { useState } from "react";
import api from "../../services/api";
import "./details.css";

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser =
  localStorage.getItem("user") ||
  sessionStorage.getItem("user");
    

    if (!storedUser) {
      alert("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!review.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(storedUser);

      const response = await api.post("/reviews", {
        userId: user.id,
        movieId: movieId,
        rating: rating,
        comment: review,
      });

      if (response.data.success) {
        setRating(0);
        setReview("");

        // Refresh Community Reviews
        if (onReviewAdded) {
          onReviewAdded();
        }

        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Submit Review Error:", error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="review-form-section">

      <h2>✍️ Write Your Review</h2>

      <p className="review-subtitle">
        How was your experience?
      </p>

      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={
              star <= rating
                ? "active-star"
                : ""
            }
          >
            ★
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        <textarea
          placeholder="Share your thoughts about this movie..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

      </form>

    </section>
  );
};

export default ReviewForm;