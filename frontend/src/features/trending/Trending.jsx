import { useEffect, useState } from "react";
import { getTrendingMovies } from "../../services/movieService";
import MovieCard from "../movies/MovieCard";
import "./trending.css";

const Trending = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getTrendingMovies();

      if (data.success) {
        setMovies(data.movies);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section id="trending"  className="movie-section">
      <h2>Trending Movies</h2>

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

export default Trending;