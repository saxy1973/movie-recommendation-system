import MovieCard from "../movies/MovieCard";
import MovieFilters from "../../features/filters/MovieFilters";
import "./top-rated.css";

const TopRated = ({
  movies = [],
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  return (
    <section className="top-rated-page">

      <div className="top-rated-header">

        <div className="top-rated-heading">

          <span className="section-label">
            MOVIRA COLLECTION
          </span>

          <h1>
            Top Rated <span>Movies</span>
          </h1>

          <p>
            Discover the highest-rated movies loved by
            audiences and critics. Find your next
            must-watch favorite.
          </p>

        </div>

        <div className="movie-count">
          <strong>{movies.length}</strong>
          <span>Movies</span>
        </div>

      </div>


      {/* FILTER */}
      <div className="top-rated-filter-area">

        <MovieFilters
          initialFilters={filters}
          onApply={onApplyFilters}
          onClear={onClearFilters}
        />

      </div>


      {/* MOVIES */}
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
            No movies match your filters
          </h3>

          <p>
            Try changing or clearing your filters.
          </p>

        </div>

      )}

    </section>
  );
};

export default TopRated;