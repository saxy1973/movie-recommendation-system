import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecentlyViewed.css";

const RecentlyViewed = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMovies =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    setMovies(savedMovies);
  }, []);

  return (
    <div className="recently-viewed-page">
      <div className="recently-viewed-container">

        <h1>Recently Viewed</h1>

        <p className="recently-viewed-subtitle">
          Movies you recently explored on Movira
        </p>

        {movies.length === 0 ? (
          <div className="no-recent-movies">
            <h2>No recently viewed movies</h2>
            <p>
              Movies you explore will appear here.
            </p>
          </div>
        ) : (
          <div className="recently-viewed-list">

            {movies.map((movie) => (
              <div
                className="recent-movie-card"
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >

                {/* POSTER */}
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="recent-movie-poster"
                />

                {/* MOVIE INFO */}
                <div className="recent-movie-info">

                  {/* MOVIE NAME */}
                  <h2>{movie.title}</h2>

                  {/* GENRE */}
                  {movie.genre && (
                    <p className="recent-movie-genre">
                      {movie.genre}
                    </p>
                  )}

                  {/* ACTORS */}
                  {movie.actors && (
                    <p className="recent-movie-actors">
                      <strong>Actors:</strong> {movie.actors}
                    </p>
                  )}

                  {/* RATING */}
                  <div className="recent-movie-rating">
                    ⭐ {movie.rating || "N/A"}
                  </div>

                  {/* VIEWED DATE */}
                  <p className="viewed-date">
                    Viewed on{" "}
                    {new Date(movie.viewedAt).toLocaleDateString()}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default RecentlyViewed;