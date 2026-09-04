import { useEffect } from "react";
import api from "../../services/api";
import ReviewCard from "./ReviewCard";
import "./details.css";

const ReviewList = ({
  movieId,
  reviews,
  setReviews,
}) => {

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const response = await api.get(
          `/reviews/${movieId}`
        );

        if (response.data.success) {
          setReviews(response.data.reviews);
        }

      } catch (error) {

        console.error(
          "Fetch Reviews Error:",
          error.response?.data ||
          error.message
        );

      }

    };

    if (movieId) {
      fetchReviews();
    }

  }, [movieId, setReviews]);


  // =========================
  // DELETE FROM UI
  // =========================

  const handleDelete = (reviewId) => {

    setReviews((prev) =>
      prev.filter(
        (review) =>
          review._id !== reviewId
      )
    );

  };


  // =========================
  // UPDATE IN UI
  // =========================

  const handleUpdate = (updatedReview) => {

    setReviews((prev) =>
      prev.map((review) =>
        review._id === updatedReview._id
          ? {
              ...review,
              ...updatedReview,
            }
          : review
      )
    );

  };


  // Get logged-in user
  const storedUser =
    localStorage.getItem("user");

  const currentUserId = storedUser
    ? JSON.parse(storedUser).id
    : null;


  return (

    <section className="review-list-section">

      <h2>⭐ Community Reviews</h2>


      {reviews.length === 0 ? (

        <p>
          No reviews yet. Be the first
          to review this movie!
        </p>

      ) : (

        reviews.map((review) => (

          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={currentUserId}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />

        ))

      )}

    </section>

  );
};

export default ReviewList;