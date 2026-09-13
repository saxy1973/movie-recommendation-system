import { useEffect, useMemo, useState } from "react";

import api from "../../services/api";
import MovieCard from "../movies/MovieCard";
import MovieFilters from "../filters/MovieFilters";
import {
  filterMovies,
  getDefaultFilters,
} from "../../services/movieFilterService";

import "./Recommendations.css";

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [preferences, setPreferences] = useState({
    genres: [],
    language: ["English"],
    industries: [],
    minRating: 7,
    contentType: "Both",
  });

  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(
    getDefaultFilters()
  );

  // =========================================
  // GET CURRENT USER
  // =========================================

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // =========================================
  // FETCH RECOMMENDATIONS
  // =========================================

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.id) {
        setError(
          "Please login to see your recommendations."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/auth/recommendations/${user.id}`
        );

        if (response.data.success) {
          const movieData =
            response.data.movies || [];

          setMovies(movieData);

          const userPreferences =
            response.data.preferences || {
              genres: [],
              language: ["English"],
              industries: [],
              minRating: 7,
              contentType: "Both",
            };

          setPreferences(userPreferences);
        }
      } catch (err) {
        console.error(
          "Recommendation Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.id]);

  // =========================================
  // FETCH USER REVIEWS
  // =========================================

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;

      try {
        const response = await api.get(
          `/reviews/user/${user.id}`
        );

        if (response.data.success) {
          const reviewMap = {};

          response.data.reviews.forEach(
            (review) => {
              reviewMap[String(review.movieId)] =
                review.rating;
            }
          );

          setReviews(reviewMap);
        }
      } catch (err) {
        console.error(
          "Reviews Error:",
          err
        );
      }
    };

    fetchReviews();
  }, [user?.id]);

  // =========================================
  // FILTER MOVIES
  // =========================================

  const filteredMovies = useMemo(() => {
    return filterMovies(
      movies,
      filters
    );
  }, [movies, filters]);

  // =========================================
  // APPLY FILTERS
  // =========================================

  const handleApplyFilters = (
    newFilters
  ) => {
    setFilters(newFilters);
  };

  // =========================================
  // CLEAR FILTERS
  // =========================================

  const handleClearFilters = (
    clearedFilters
  ) => {
    setFilters(clearedFilters);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="recommendations-loading">

          <div className="loading-spinner"></div>

          <h2>
            Finding movies for you...
          </h2>

          <p>
            We're using your preferences
            and recently viewed movies.
          </p>

        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="recommendations-page">

        <div className="recommendations-empty">

          <div className="empty-icon">
            🎬
          </div>

          <h2>
            Oops!
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="recommendations-page">

      <div className="recommendations-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="recommendations-header">

          <div>

            <span className="recommendations-label">
              CURATED FOR YOU
            </span>

            <h1>
              Your <span>Recommendations</span> ✨
            </h1>

            <p>
              Movies picked based on your
              preferences, recently viewed
              movies and reviews.
            </p>

          </div>

        </div>

        {/* =========================
            FILTERS
        ========================= */}

        <div className="recommendation-filter-area">

          <MovieFilters
            initialFilters={filters}
            showYear={true}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

        </div>

        {/* =========================
            MOVIES
        ========================= */}

        <div className="movies-section">

          <div className="section-title">

            <div>

              <h2>
                Made for <span>You</span>
              </h2>

              <p>
                Based on what you've been watching
              </p>

            </div>

            <div className="movie-count">
              {filteredMovies.length} movies
            </div>

          </div>

          {filteredMovies.length === 0 ? (

            <div className="no-movies">

              <div>
                🎬
              </div>

              <h3>
                No movies found
              </h3>

              <p>
                Try changing your filters to
                discover more movies.
              </p>

            </div>

          ) : (

            <div className="recommendation-grid">

              {filteredMovies.map(
                (movie, index) => {

                  const userRating =
                    reviews[
                      String(
                        movie.id ||
                        movie.imdbID
                      )
                    ];

                  return (
                    <MovieCard
                      key={
                        movie.id ||
                        movie.imdbID ||
                        index
                      }
                      movie={{
                        imdbID:
                          movie.imdbID ||
                          movie.id,

                        Title:
                          movie.Title ||
                          movie.title,

                        Year:
                          movie.Year ||
                          movie.year,

                        Poster:
                          movie.Poster ||
                          movie.poster,

                        Type:
                          movie.Type ||
                          movie.type,

                        Rating:
                          movie.Rating ||
                          movie.rating,

                        Overview:
                          movie.Overview ||
                          movie.overview,
                      }}
                    />
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Recommendations;