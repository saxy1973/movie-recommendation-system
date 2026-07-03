import MovieCard from "../movies/MovieCard";
import "./top-rated.css";

const TopRated = ({ movies }) => {
  return (
    <section className="top-rated">

      <div className="section-header">
        <h2>Top Rated Movies</h2>
      </div>

      <div className="movie-grid">
        {movies.slice(0, 6).map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
          />
        ))}
      </div>

    </section>
  );
};

export default TopRated;