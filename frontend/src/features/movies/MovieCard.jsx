import { useNavigate } from "react-router-dom";
import "./movie.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={movie.Title}
        className="movie-poster"
      />

      <div className="movie-info">
        <h3>{movie.Title}</h3>

        <p>📅 {movie.Year}</p>

        <span className="movie-type">
          {movie.Type}
        </span>

        <button
  className="details-btn"
  onClick={() => navigate(`/movie/${movie.imdbID}`)}
>
  View Details
</button>
      </div>
    </div>
  );
};

export default MovieCard;