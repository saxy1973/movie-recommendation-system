import MovieCard from "../movies/MovieCard";
import MovieFilters from "../filters/MovieFilters";
import "./trending.css";

const Trending = ({
  movies = [],
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <section className="trending-page">

      <div className="trending-header">
        <div>
          <span className="section-label">
            MOVIRA COLLECTION
          </span>

          <h1>
            Trending <span>Movies</span>
          </h1>

          <p>
            Explore movies everyone is talking about right now.
            Discover what's trending and find your next watch.
          </p>
        </div>

        <div className="movie-count">
          <strong>{movies.length}</strong>
          <span>Movies</span>
        </div>
      </div>

      <div className="trending-filter-area">
        <MovieFilters
          initialFilters={filters}
          onApply={onApplyFilters}
          onClear={onClearFilters}
        />
      </div>

      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id || movie.imdbID || index}
              movie={movie}
            />
          ))}
        </div>
      ) : (
        <div className="empty-movies">
          <div className="empty-icon">🔥</div>

          <h3>No trending movies match your filters</h3>

          <p>
            Try changing or clearing your filters.
          </p>
        </div>
      )}

    </section>
  );
};

export default Trending;