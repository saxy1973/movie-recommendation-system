import { useNavigate } from "react-router-dom";
import WishlistButton from "../wishlist/WishlistButton";
import "./movie.css";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // =========================
  // MOVIE DATA
  // =========================

  const id = movie.imdbID || movie.id;

  const title =
    movie.Title ||
    movie.title ||
    movie.name ||
    "Untitled";

  const poster =
    movie.Poster ||
    movie.poster;

  const year =
    movie.Year ||
    movie.year ||
    movie.releaseDate ||
    movie.release_date ||
    movie.first_air_date ||
    "N/A";

  const rating =
    movie.rating ??
    movie.Rating ??
    movie.vote_average;

  // =========================
  // MOVIE / SERIES TYPE
  // =========================

  const type =
    movie.Type ||
    movie.type ||
    (movie.media_type === "tv" ? "series" : "movie");

  const normalizedType =
    String(type).toLowerCase() === "series" ||
    String(type).toLowerCase() === "tv"
      ? "series"
      : "movie";

  // =========================
  // OPEN DETAILS
  // =========================

  const handleMovieClick = () => {
    navigate(
      `/movie/${id}?type=${normalizedType}`
    );
  };

  return (
    <div
      className="movie-card"
      onClick={handleMovieClick}
    >

      {/* =========================
          MOVIE / SERIES BADGE
      ========================= */}

      <div className="movie-badge">
        {normalizedType === "series"
          ? "TV SERIES"
          : "MOVIE"}
      </div>


      {/* =========================
          POSTER
      ========================= */}

      <img
        src={
          poster && poster !== "N/A"
            ? poster
            : "https://placehold.co/300x450?text=No+Image"
        }
        alt={title}
        className="movie-poster"
      />


      {/* =========================
          WISHLIST
      ========================= */}

      <div
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistButton movieId={id} />
      </div>


      {/* =========================
          MOVIE INFORMATION
      ========================= */}

      <div className="movie-overlay">

        <h3 className="movie-title">
          {title}
        </h3>

        <p className="movie-subtitle">

          {year}

          {rating !== undefined &&
            rating !== null && (
              <>
                {" • "}
                ⭐ {Number(rating).toFixed(1)}
              </>
            )}

        </p>

      </div>

    </div>
  );
};

export default MovieCard;