import MovieCard from "./MovieCard";
import "./movie.css";

const MovieGrid = ({ movies }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
