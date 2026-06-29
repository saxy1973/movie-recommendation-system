import ReviewCard from "./ReviewCard";
import "./details.css";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "One of Christopher Nolan's best movies. Amazing cinematography and acting.",
    time: "2 days ago",
    helpful: 24,
  },

  {
    name: "Priya Singh",
    rating: 4,
    comment:
      "Loved every moment. The soundtrack and visuals were outstanding.",
    time: "5 days ago",
    helpful: 12,
  },

  {
    name: "Aman Verma",
    rating: 5,
    comment:
      "Definitely worth watching again. One of the best Batman movies.",
    time: "1 week ago",
    helpful: 31,
  },
];

const ReviewList = () => {
  return (
    <section className="review-list-section">

      <h2>⭐ Community Reviews</h2>

      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          review={review}
        />
      ))}

    </section>
  );
};

export default ReviewList;