import { useEffect, useState } from "react";
import api from "../services/api";
import "./Wishlist.css";
import MovieGrid from "../features/movies/MovieGrid";

const Wishlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // ==========================================
        // GET CURRENT USER
        // ==========================================

        const storedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const userId = user.id || user._id;

        if (!userId) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }

        // ==========================================
        // GET WISHLIST FROM MONGODB
        // ==========================================

        const response = await api.get(
          `/wishlist/${userId}`
        );

        console.log("Wishlist Response:", response.data);

        if (!response.data.success) {
          setMovies([]);
          return;
        }

        const wishlistItems =
          response.data.wishlist || [];

        // ==========================================
        // NO WISHLIST ITEMS
        // ==========================================

        if (wishlistItems.length === 0) {
          setMovies([]);
          return;
        }

        // ==========================================
        // GET COMPLETE MOVIE DETAILS
        // ==========================================

        const movieDetails = await Promise.all(
          wishlistItems.map(async (item) => {
            try {
              const movieResponse = await api.get(
                `/movie/${item.movieId}`
              );

              console.log(
                `Movie ${item.movieId} Response:`,
                movieResponse.data
              );

              /*
                Handle both possible backend responses:

                {
                  success: true,
                  movie: {...}
                }

                OR

                {...movie data...}
              */

              if (movieResponse.data?.movie) {
                return movieResponse.data.movie;
              }

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

        // ==========================================
        // REMOVE FAILED MOVIES
        // ==========================================

        setMovies(
          movieDetails.filter(Boolean)
        );

      } catch (error) {
        console.error(
          "Fetch Wishlist Error:",
          error
        );

        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="wishlist-page">
        <h1>
  My <span>Wishlist</span>
</h1>

        <p>
          Loading your wishlist...
        </p>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="wishlist-page">
<div className="wishlist-header">

  <h1>
    My <span>Wishlist</span>
  </h1>

  <p>
    Movies you saved for later
  </p>

</div>

      {movies.length === 0 ? (

        <div className="empty-wishlist">

          <div className="empty-icon">
            ♡
          </div>

          <h2>
            Your Wishlist is Empty
          </h2>

          <p>
            Save movies you want to watch later.
          </p>

        </div>

      ) : (

        <MovieGrid
          movies={movies}
        />

      )}

    </div>
  );
};

export default Wishlist;