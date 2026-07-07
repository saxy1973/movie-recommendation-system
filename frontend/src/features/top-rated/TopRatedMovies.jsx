import MovieCard from "../movies/MovieCard";
import "./top-rated.css";

const TopRated = ({ movies }) => {
  return (
    <section className="movie-section">
      <h2>Top Rated Movies</h2>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
};

export default TopRated;