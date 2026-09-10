import { useEffect } from "react";
import "./details.css";
import WishlistButton from "../wishlist/WishlistButton";

const saveRecentlyViewed = (movie) => {
  const existing =
    JSON.parse(localStorage.getItem("recentlyViewed")) || [];

const movieData = {
  id: movie.imdbID,
  title: movie.Title,
  poster: movie.Poster,
  rating: movie.Rating,
  genre: movie.Genre,
  actors: movie.Actors,
  viewedAt: new Date().toISOString(),
};

  const filtered = existing.filter(
    (item) => String(item.id) !== String(movieData.id)
  );

  const updated = [movieData, ...filtered].slice(0, 20);

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(updated)
  );
};



const MovieInfo = ({ movie }) => {
  useEffect(() => {
  if (movie) {
    saveRecentlyViewed(movie);
  }
}, [movie]);
  return (
    <section className="movie-info-container">

      <div className="movie-poster-section">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="details-poster"
        />
      </div>

      <div className="movie-content">

        <h1>{movie.Title}</h1>

    <div className="movie-meta">

  <span className="movie-rating">
    ⭐ {movie.Rating ? Number(movie.Rating).toFixed(1) : "N/A"}/10
  </span>

  <span>
    📅 {movie.Year || "N/A"}
  </span>

  <span>
    ⏱ {movie.Runtime || "N/A"}
  </span>

  <span>
    {movie.Type === "series"
      ? "📺 Series"
      : "🎬 Movie"}
  </span>

  <div className="details-wishlist-wrapper">
    <WishlistButton
      movieId={movie.imdbID || movie.id}
    />
  </div>

</div>

        <div className="movie-genre">
          {movie.Genre}
        </div>

        <div className="movie-details-list">

          <p>
            <strong>Director:</strong> {movie.Director}
          </p>

          <p>
            <strong>Actors:</strong> {movie.Actors}
          </p>

         <p>
  <strong>Language:</strong> {movie.Language || "N/A"}
</p>

<p>
  <strong>Country:</strong> {movie.Country || "N/A"}
</p>

        </div>

        <h3>Story</h3>

        <p className="movie-plot">
          {movie.Plot}
        </p>

      </div>

    </section>
  );
};

export default MovieInfo;