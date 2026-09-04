import { useState } from "react";
import api from "../../services/api";
import "./details.css";

const ReviewCard = ({
  review,
  currentUserId,
  onDelete,
  onUpdate,
}) => {

  const reviewUserId =
    review.user?._id || review.user;

  const canEdit =
    String(reviewUserId) === String(currentUserId);

  const canDelete =
    String(reviewUserId) === String(currentUserId);

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);


  // =========================
  // UPDATE REVIEW
  // =========================

  const handleUpdate = async () => {

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {

      setLoading(true);

      const response = await api.put(
        `/reviews/${review._id}`,
        {
          userId: currentUserId,
          rating: rating,
          comment: comment,
        }
      );

      if (response.data.success) {

        setIsEditing(false);

        if (onUpdate) {
          onUpdate(response.data.review);
        }

        alert("Review updated successfully!");
      }

    } catch (error) {

      console.error(
        "Update Review Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // DELETE REVIEW
  // =========================

  const handleDelete = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmDelete) return;

    try {

      setLoading(true);

      const response = await api.delete(
        `/reviews/${review._id}`,
        {
          data: {
            userId: currentUserId,
          },
        }
      );

      if (response.data.success) {

        if (onDelete) {
          onDelete(review._id);
        }

        alert("Review deleted successfully!");
      }

    } catch (error) {

      console.error(
        "Delete Review Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="review-card">

      <div className="review-top">

        <div className="review-user">

          <div className="review-avatar">
            👤
          </div>

          <div>

            <h3>
              {review.user?.name || "User"}
            </h3>

            <p className="verified">
              ✔ Verified Viewer
            </p>

          </div>

        </div>


        {!isEditing && (

          <div className="review-rating">

            <span>
              {"★".repeat(review.rating)}
            </span>

            <p>
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

        )}

      </div>


      {/* =========================
          EDIT MODE
      ========================= */}

      {isEditing ? (

        <div className="edit-review">

          <div className="rating">

            {[1, 2, 3, 4, 5].map((star) => (

              <span
                key={star}
                onClick={() =>
                  setRating(star)
                }
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


          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />


          <div className="review-actions">

            <button
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save"}
            </button>

            <button
              onClick={() =>
                setIsEditing(false)
              }
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>

      ) : (

        <p className="review-message">
          {review.comment}
        </p>

      )}


      {/* =========================
          EDIT / DELETE
      ========================= */}

      {!isEditing && canEdit && (

        <div className="review-footer">

          <button
            onClick={() =>
              setIsEditing(true)
            }
          >
             Edit
          </button>

          {canDelete && (

            <button
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>

          )}

        </div>

      )}

    </div>
  );
};

export default ReviewCard;