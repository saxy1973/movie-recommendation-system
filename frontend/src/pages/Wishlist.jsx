import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../features/movies/MovieCard";
import "./wishlist.css";
import MovieGrid from "../features/movies/MovieGrid";

const Wishlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // Get wishlist from MongoDB
        const response = await api.get(
          `/wishlist/${user.id}`
        );

        if (!response.data.success) {
          return;
        }

        const wishlistItems = response.data.wishlist;

        // Get complete movie details from TMDB through our backend
        const movieDetails = await Promise.all(
          wishlistItems.map(async (item) => {
            try {
              const movieResponse = await api.get(
                `/movie/${item.movieId}`
              );

              return movieResponse.data;
            } catch (error) {
              console.error(
                `Movie ${item.movieId} Error:`,
                error
              );

              return null;
            }
          })
        );

        setMovies(movieDetails.filter(Boolean));

      } catch (error) {
        console.error(
          "Fetch Wishlist Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="wishlist-page">
        <h1>My Wishlist</h1>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">
        <h1>My Wishlist</h1>

        <p>
          Movies you saved for later
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">♡</div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save movies you want to watch later.
          </p>
        </div>
      ) : (
       <MovieGrid movies={movies} />
      )}

    </div>
  );
};

export default Wishlist;