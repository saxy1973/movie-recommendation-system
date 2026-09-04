import "./details.css";
import WishlistButton from "../wishlist/WishlistButton";

const MovieInfo = ({ movie }) => {
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

  <span>⭐ {movie.imdbRating}</span>

  <span>📅 {movie.Year}</span>

  <span>⏱ {movie.Runtime}</span>

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
            <strong>Language:</strong> {movie.Language}
          </p>

          <p>
            <strong>Country:</strong> {movie.Country}
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