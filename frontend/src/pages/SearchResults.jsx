import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MovieFilters from "../features/filters/MovieFilters";
import MovieGrid from "../features/movies/MovieGrid";

import {
  filterMovies,
  getDefaultFilters,
} from "../services/movieFilterService";

import { searchMovies } from "../services/movieService";

import "./SearchResults.css";

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialMovies = state?.movies || [];
  const initialQuery = state?.query || "";

  const [movies, setMovies] = useState(initialMovies);
  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] =
    useState(initialQuery);

  const [searching, setSearching] =
    useState(false);

  const [filters, setFilters] = useState(
    getDefaultFilters()
  );

  // =========================
  // FILTERED MOVIES
  // =========================

  const filteredMovies = useMemo(() => {
    return filterMovies(
      movies,
      filters
    );
  }, [movies, filters]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async () => {
    const trimmedQuery =
      searchInput.trim();

    if (!trimmedQuery) {
      return;
    }

    try {
      setSearching(true);

      const data = await searchMovies(
        trimmedQuery
      );

      const newMovies =
        data.Search ||
        data.movies ||
        [];

      setMovies(newMovies);
      setQuery(trimmedQuery);

      // Reset filters after new search
      setFilters(
        getDefaultFilters()
      );

      // Update route state
      navigate(
        "/search-results",
        {
          replace: true,
          state: {
            movies: newMovies,
            query: trimmedQuery,
          },
        }
      );

    } catch (error) {
      console.error(
        "Search Results Error:",
        error
      );

      setMovies([]);
    } finally {
      setSearching(false);
    }
  };

  // =========================
  // ENTER KEY
  // =========================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // =========================
  // FILTER APPLY
  // =========================

  const handleApplyFilters = (
    newFilters
  ) => {
    setFilters(newFilters);
  };

  // =========================
  // FILTER CLEAR
  // =========================

  const handleClearFilters = (
    clearedFilters
  ) => {
    setFilters(clearedFilters);
  };

  return (
    <section className="search-results-page">

      <div className="search-results-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="search-results-header">

          {/* LEFT */}
          <div className="search-header-content">

            <span className="section-label">
              MOVIRA SEARCH
            </span>

            <h1>
              Search{" "}
              <span>Results</span>
            </h1>

            {query && (
              <p className="search-description">
                Showing results for{" "}
                <strong>
                  "{query}"
                </strong>
              </p>
            )}

          </div>


          {/* RIGHT */}
          <div className="search-header-right">

            {/* SEARCH BAR */}
            <div className="search-box">

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search movies..."
                aria-label="Search movies"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={
                  searching ||
                  !searchInput.trim()
                }
              >
                {searching
                  ? "..."
                  : "Search"}
              </button>

            </div>


            {/* MOVIE COUNT */}
            <div className="movie-count">

              <strong>
                {filteredMovies.length}
              </strong>

              <span>
                Movies
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            FILTERS
        ========================= */}

        <div className="search-filter-area">

          <MovieFilters
            initialFilters={filters}
            showYear={true}
            onApply={
              handleApplyFilters
            }
            onClear={
              handleClearFilters
            }
          />

        </div>


        {/* =========================
            RESULTS
        ========================= */}

        {filteredMovies.length > 0 ? (

          <MovieGrid
            movies={filteredMovies}
          />

        ) : (

          <div className="search-empty">

            <div className="empty-icon">
              🎬
            </div>

            <h3>
              No movies match your
              search or filters
            </h3>

            <p>
              Try another search or
              clear your filters.
            </p>

          </div>

        )}

      </div>

    </section>
  );
};

export default SearchResults;