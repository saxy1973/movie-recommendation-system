import { useEffect, useState } from "react";
import axios from "axios";

const HeroBanner = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchFeaturedMovie();
  }, []);

  const fetchFeaturedMovie = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/featured");

      if (res.data.success) {
        setMovie(res.data.movie);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!movie) return null;

  return (
    <div
      className="featured-movie"
      style={{
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(13,17,23,1) 0%,
            rgba(13,17,23,0.98) 22%,
            rgba(13,17,23,0.92) 35%,
            rgba(13,17,23,0.70) 45%,
            rgba(13,17,23,0.30) 58%,
            rgba(13,17,23,0.05) 72%,
            rgba(13,17,23,0) 100%
          ),
          url(${movie.backdrop})
        `,
      }}
    />
  );
};

export default HeroBanner;