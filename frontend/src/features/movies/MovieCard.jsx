import { useNavigate } from "react-router-dom";
import "./movie.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Support both OMDb and TMDB
  const id = movie.imdbID || movie.id;
  const title = movie.Title || movie.title;
  const poster = movie.Poster || movie.poster;
  const year = movie.Year || movie.year || movie.releaseDate;
  const type = movie.Type || "Movie";

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${id}`)}
    >
      <div className="movie-badge">
        {type === "series" ? "TV SERIES" : "MOVIE"}
      </div>

      <img
        src={
          poster && poster !== "N/A"
            ? poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={title}
        className="movie-poster"
      />

      <div className="movie-overlay">
        <h3 className="movie-title">{title}</h3>

        <p className="movie-subtitle">
          {year}
          {movie.rating && ` • ⭐ ${movie.rating.toFixed(1)}`}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;