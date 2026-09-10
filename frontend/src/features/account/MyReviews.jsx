import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyReviews.css";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  // =========================================
  // FETCH MY REVIEWS
  // =========================================

  const fetchReviews = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const reviewResponse = await api.get(
        `/reviews/user/${user.id}`
      );

      const userReviews =
        reviewResponse.data.reviews || [];

      const reviewsWithMovie = await Promise.all(
        userReviews.map(async (review) => {
          try {
            const movieResponse = await api.get(
              `/movie/${review.movieId}`
            );

            return {
              ...review,
              movie: movieResponse.data,
            };
          } catch (error) {
            console.error(
              `Movie ${review.movieId} fetch failed`,
              error
            );

            return {
              ...review,
              movie: null,
            };
          }
        })
      );

      setReviews(reviewsWithMovie);
    } catch (error) {
      console.error(
        "Reviews Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  // =========================================
  // EDIT REVIEW
  // =========================================

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // =========================================
  // UPDATE REVIEW
  // =========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await api.put(
        `/reviews/${editingReview._id}`,
        {
          userId: user.id,
          rating: editRating,
          comment: editComment,
        }
      );

      const updatedReview =
        response.data.review;

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id
            ? {
                ...review,
                rating: updatedReview.rating,
                comment: updatedReview.comment,
                createdAt:
                  updatedReview.createdAt,
              }
            : review
        )
      );

      setEditingReview(null);
    } catch (error) {
      console.error(
        "Update Review Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update review"
      );
    }
  };

  // =========================================
  // DELETE REVIEW
  // =========================================

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/reviews/${reviewId}`,
        {
          data: {
            userId: user.id,
          },
        }
      );

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) =>
            review._id !== reviewId
        )
      );
    } catch (error) {
      console.error(
        "Delete Review Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  // =========================================
  // NOT LOGGED IN
  // =========================================

  if (!user) {
    return (
      <div className="myreviews-page">
        <div className="myreviews-empty">
          <h2>Please login again</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="myreviews-page">

      <div className="myreviews-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="myreviews-header">
          <h1>My Reviews</h1>

          <p>
            Reviews you have shared on Movira
          </p>
        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="myreviews-empty">
            <h2>Loading reviews...</h2>
          </div>
        )}


        {/* =========================
            NO REVIEWS
        ========================= */}

        {!loading &&
          reviews.length === 0 && (
            <div className="myreviews-empty">

              <h2>No reviews yet</h2>

              <p>
                Movies you review will appear
                here.
              </p>

            </div>
          )}


        {/* =========================
            REVIEWS LIST
        ========================= */}

        {!loading &&
          reviews.length > 0 && (

            <div className="myreviews-list">

              {reviews.map((review) => (

                <div
                  className="myreviews-card"
                  key={review._id}
                >

                  {/* POSTER */}

                  <div className="myreviews-poster">

                    {review.movie?.Poster ? (

                      <img
                        src={review.movie.Poster}
                        alt={
                          review.movie.Title
                        }
                      />

                    ) : (

                      <div className="myreviews-poster-placeholder">
                        🎬
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="myreviews-content">

                    {/* MOVIE NAME */}

                    <h2>
                      {review.movie?.Title ||
                        `Movie #${review.movieId}`}
                    </h2>


                    {/* YEAR */}

                    {review.movie?.Year && (
                      <span className="myreviews-year">
                        {review.movie.Year}
                      </span>
                    )}


                    {/* RATING */}

                    <div className="myreviews-rating">

                      <span className="myreviews-stars">
                        {"★".repeat(
                          review.rating
                        )}

                        {"☆".repeat(
                          5 - review.rating
                        )}
                      </span>

                      <span className="myreviews-rating-number">
                        {review.rating}/5
                      </span>

                    </div>


                    {/* COMMENT */}

                    <p className="myreviews-comment">
                      "{review.comment}"
                    </p>


                    {/* DATE */}

                    <p className="myreviews-date">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                  </div>


                  {/* ACTIONS */}

                  <div className="myreviews-actions">

                    <button
                      className="myreviews-edit-btn"
                      onClick={() =>
                        handleEdit(review)
                      }
                    >
                       Edit
                    </button>

                    <button
                      className="myreviews-delete-btn"
                      onClick={() =>
                        handleDelete(
                          review._id
                        )
                      }
                    >
                       Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>


      {/* =========================
          EDIT MODAL
      ========================= */}

      {editingReview && (

        <div className="myreviews-modal-overlay">

          <div className="myreviews-modal">

            {/* CLOSE */}

            <button
              className="myreviews-close-btn"
              onClick={() =>
                setEditingReview(null)
              }
            >
              ×
            </button>


            <h2>
              Edit Your Review
            </h2>


            <p className="myreviews-modal-movie">
              {editingReview.movie?.Title ||
                `Movie #${editingReview.movieId}`}
            </p>


            {/* RATING */}

            <label>
              Rating
            </label>

            <div className="myreviews-edit-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <span
                    key={star}
                    className={
                      star <= editRating
                        ? "myreviews-active-star"
                        : "myreviews-inactive-star"
                    }
                    onClick={() =>
                      setEditRating(star)
                    }
                  >
                    ★
                  </span>

                )
              )}

            </div>


            {/* COMMENT */}

            <label>
              Your Review
            </label>

            <textarea
              value={editComment}
              onChange={(e) =>
                setEditComment(
                  e.target.value
                )
              }
              rows="5"
              placeholder="Write your review..."
            />


            {/* MODAL BUTTONS */}

            <div className="myreviews-modal-actions">

              <button
                className="myreviews-cancel-btn"
                onClick={() =>
                  setEditingReview(null)
                }
              >
                Cancel
              </button>

              <button
                className="myreviews-save-btn"
                onClick={handleUpdate}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyReviews;