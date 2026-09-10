import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Recommendations.css";

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

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

  // =========================================
  // FILTERS
  // =========================================

  const [filters, setFilters] = useState({
    year: "All",
    language: "All",
    industry: "All",
    genre: "All",
    contentType: "Both",
  });

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
        setError("Please login to see your recommendations.");
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
          const movieData = response.data.movies || [];

          setMovies(movieData);
          setFilteredMovies(movieData);

          const userPreferences =
            response.data.preferences || {
              genres: [],
              language: ["English"],
              industries: [],
              minRating: 7,
              contentType: "Both",
            };

          setPreferences(userPreferences);

          // Default content type from preference
          setFilters((prev) => ({
            ...prev,
            contentType:
              userPreferences.contentType || "Both",
          }));
        }
      } catch (err) {
        console.error("Recommendation Error:", err);

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

          response.data.reviews.forEach((review) => {
            reviewMap[String(review.movieId)] =
              review.rating;
          });

          setReviews(reviewMap);
        }
      } catch (err) {
        console.error("Reviews Error:", err);
      }
    };

    fetchReviews();
  }, [user?.id]);

  // =========================================
  // FILTER MOVIES
  // =========================================

  useEffect(() => {
    let result = [...movies];

    // YEAR
    if (filters.year !== "All") {
      result = result.filter((movie) => {
        const movieYear = Number(movie.year);

        if (!movieYear) return false;

        if (filters.year === "2000-2010") {
          return movieYear >= 2000 && movieYear <= 2010;
        }

        if (filters.year === "2011-2020") {
          return movieYear >= 2011 && movieYear <= 2020;
        }

        if (filters.year === "2021-2030") {
          return movieYear >= 2021 && movieYear <= 2030;
        }

        return true;
      });
    }

    // LANGUAGE
    if (filters.language !== "All") {
      result = result.filter((movie) => {
        const movieLanguage =
          movie.language ||
          movie.Language ||
          "";

        return (
          String(movieLanguage).toLowerCase() ===
          String(filters.language).toLowerCase()
        );
      });
    }

    // INDUSTRY
    if (filters.industry !== "All") {
      result = result.filter((movie) => {
        const movieIndustry =
          movie.industry ||
          movie.Industry ||
          "";

        return (
          String(movieIndustry).toLowerCase() ===
          String(filters.industry).toLowerCase()
        );
      });
    }

    // GENRE
    if (filters.genre !== "All") {
      result = result.filter((movie) => {
        const movieGenre =
          movie.genre ||
          movie.Genre ||
          "";

        if (Array.isArray(movieGenre)) {
          return movieGenre.some(
            (genre) =>
              String(genre).toLowerCase() ===
              String(filters.genre).toLowerCase()
          );
        }

        return String(movieGenre)
          .toLowerCase()
          .includes(
            String(filters.genre).toLowerCase()
          );
      });
    }

    // CONTENT TYPE
    if (filters.contentType !== "Both") {
      result = result.filter((movie) => {
        const movieType =
          movie.type ||
          movie.Type ||
          "movie";

        if (filters.contentType === "Movies") {
          return movieType.toLowerCase() === "movie";
        }

        if (filters.contentType === "Series") {
          return movieType.toLowerCase() === "series";
        }

        return true;
      });
    }

    setFilteredMovies(result);
  }, [movies, filters]);

  // =========================================
  // FILTER CHANGE
  // =========================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>

          <h2>Finding movies for you...</h2>

          <p>
            We're using your preferences and recently
            viewed movies.
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

          <div className="empty-icon">🎬</div>

          <h2>Oops!</h2>

          <p>{error}</p>

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

        {/* HEADER */}

        <div className="recommendations-header">

          <div>

            <span className="recommendations-label">
              CURATED FOR YOU
            </span>

            <h1>
              Your <span>Recommendations</span> ✨
            </h1>

            <p>
              Movies picked based on your preferences,
              recently viewed movies and reviews.
            </p>

          </div>

        </div>


        {/* =====================================
            FILTER BAR
        ===================================== */}

        <div className="recommendation-filters">

          {/* YEAR */}

          <div className="filter-group">

            <label>Year</label>

            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="2000-2010">
                2000–2010
              </option>
              <option value="2011-2020">
                2011–2020
              </option>
              <option value="2021-2030">
                2021–2030
              </option>
            </select>

          </div>


          {/* LANGUAGE */}

          <div className="filter-group">

            <label>Language</label>

            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
            >

              <option value="All">
                All
              </option>

              {[
                ...new Set([
                  ...(preferences.language || []),
                  "English",
                  "Hindi",
                  "Korean",
                  "Japanese",
                  "Spanish",
                ]),
              ].map((language) => (

                <option
                  key={language}
                  value={language}
                >
                  {language}
                </option>

              ))}

            </select>

          </div>


          {/* INDUSTRY */}

          <div className="filter-group">

            <label>Industry</label>

            <select
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
            >

              <option value="All">
                All
              </option>

              {(preferences.industries || []).map(
                (industry) => (

                  <option
                    key={industry}
                    value={industry}
                  >
                    {industry}
                  </option>

                )
              )}

            </select>

          </div>


          {/* GENRE */}

          <div className="filter-group">

            <label>Genre</label>

            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
            >

              <option value="All">
                All
              </option>

              {(preferences.genres || []).map(
                (genre) => (

                  <option
                    key={genre}
                    value={genre}
                  >
                    {genre}
                  </option>

                )
              )}

            </select>

          </div>


          {/* CONTENT TYPE */}

          <div className="filter-group">

            <label>Content Type</label>

            <select
              name="contentType"
              value={filters.contentType}
              onChange={handleFilterChange}
            >

              <option value="Both">
                Both
              </option>

              <option value="Movies">
                Movies
              </option>

              <option value="Series">
                Series
              </option>

            </select>

          </div>

        </div>


        {/* =====================================
            MOVIES
        ===================================== */}

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

              <div>🎬</div>

              <h3>
                No movies found
              </h3>

              <p>
                Try changing your filters to discover
                more movies.
              </p>

            </div>

          ) : (

            <div className="recommendation-grid">

              {filteredMovies.map((movie) => {

                const userRating =
                  reviews[String(movie.id)];

                return (

                  <div
                    className="recommendation-card"
                    key={movie.id}
                  >

                    {/* POSTER */}

                    <div className="movie-poster-wrapper">

                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="movie-poster"
                      />

                      <div className="poster-overlay">

                        <span className="watch-text">
                          Recommended for you
                        </span>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="movie-info">

                      <h3 title={movie.title}>
                        {movie.title}
                      </h3>


                      <div className="movie-meta">

                        <span>
                          {movie.year}
                        </span>

                        <span className="dot">
                          •
                        </span>

                        <span>
                          {movie.type === "series"
                            ? "TV Series"
                            : "Movie"}
                        </span>

                      </div>


                      {/* RATINGS */}

                      <div className="rating-row">

                        <div className="tmdb-rating">

                          <span>⭐</span>

                          <strong>
                            {Number(
                              movie.rating || 0
                            ).toFixed(1)}
                          </strong>

                          <small>
                            /10
                          </small>

                        </div>


                        {userRating && (

                          <div className="user-rating">

                            <span>★</span>

                            <strong>
                              {userRating}
                            </strong>

                            <small>
                              /5
                            </small>

                          </div>

                        )}

                      </div>


                      {/* USER REVIEW */}

                      {userRating && (

                        <div className="your-review">
                          ✓ You reviewed this movie
                        </div>

                      )}


                      <p className="movie-overview">
                        {movie.overview}
                      </p>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Recommendations;