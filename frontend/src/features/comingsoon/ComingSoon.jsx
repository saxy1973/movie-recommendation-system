import MovieCard from "../movies/MovieCard";
import MovieFilters from "../filters/MovieFilters";
import "./comingsoon.css";

const ComingSoon = ({
  movies = [],
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <section className="coming-soon-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="coming-soon-header">

        <div>
          <span className="section-label">
            MOVIRA COLLECTION
          </span>

          <h1>
            Coming Soon <span>Movies</span>
          </h1>

          <p>
            Get ready for the most exciting movies
            arriving soon. Keep an eye on what’s
            next in the world of cinema.
          </p>
        </div>

        <div className="movie-count">
          <strong>{movies.length}</strong>
          <span>Movies</span>
        </div>

      </div>

      {/* =========================
          FILTERS
      ========================= */}
      <div className="coming-soon-filter-area">
        <MovieFilters
          initialFilters={filters}
          showYear={false}
          onApply={onApplyFilters}
          onClear={onClearFilters}
        />
      </div>

      {/* =========================
          MOVIES
      ========================= */}
      {movies.length > 0 ? (

        <div className="movie-grid">

          {movies.map((movie, index) => (
            <MovieCard
              key={
                movie.id ||
                movie.imdbID ||
                index
              }
              movie={movie}
            />
          ))}

        </div>

      ) : (

        <div className="empty-movies">

          <div className="empty-icon">
            🎬
          </div>

          <h3>
            No upcoming movies match your filters
          </h3>

          <p>
            Try changing or clearing your filters.
          </p>

        </div>

      )}

    </section>
  );
};

export default ComingSoon;