import { useNavigate } from "react-router-dom";
import "./movie.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.imdbID}`)}
    >
      {/* Badge */}
      <div className="movie-badge">
        {movie.Type === "series" ? "TV SERIES" : "MOVIE"}
      </div>

      {/* Poster */}
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={movie.Title}
        className="movie-poster"
      />

      {/* Overlay */}
      <div className="movie-overlay">
        <h3 className="movie-title">{movie.Title}</h3>

        <p className="movie-subtitle">
          {movie.Year} • {movie.Type}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;