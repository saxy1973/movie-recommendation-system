import { useEffect, useState } from "react";
import { getComingSoonMovies } from "../../services/movieService";
import MovieCard from "../movies/MovieCard";
import "./comingsoon.css";

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);
const loadMovies = async () => {
  try {
    const data = await getComingSoonMovies();

    console.log(data); // <-- Add this

    if (data.success) {
      setMovies(data.movies);
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <section className="movie-section">
      <h2>Coming Soon</h2>

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

export default ComingSoon;