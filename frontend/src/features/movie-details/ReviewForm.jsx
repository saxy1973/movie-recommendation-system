import { useState } from "react";
import "./details.css";

const ReviewForm = () => {

  const [rating, setRating] = useState(0);

  const [review, setReview] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log({
      rating,
      review
    });

    setRating(0);
    setReview("");
  };

  return (

    <section className="review-form-section">

      <h2>✍️ Write Your Review</h2>

      <p className="review-subtitle">
        How was your experience?
      </p>

      <div className="rating">

        {[1,2,3,4,5].map((star)=>(
          <span

            key={star}

            onClick={()=>setRating(star)}

            className={
              star<=rating
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

          onChange={(e)=>setReview(e.target.value)}

        />

        <button type="submit">

          Submit Review

        </button>

      </form>

    </section>

  );
};

export default ReviewForm;