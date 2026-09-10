import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import MovieInfo from "../features/movie-details/MovieInfo";
import Trailer from "../features/movie-details/Trailer";
import Cast from "../features/movie-details/Cast";
import ReviewForm from "../features/movie-details/ReviewForm";
import ReviewList from "../features/movie-details/ReviewList";

import Loading from "../features/loading";

import { getMovieDetails } from "../services/movieService";
import { getMovieTrailer } from "../services/trailerService";

const MovieDetails = () => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || "movie";

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setMovie(null);

        const movieData = await getMovieDetails(
          id,
          type
        );

        setMovie(movieData);

        const trailerData = await getMovieTrailer(
          id,
          type
        );

        setTrailer(trailerData);

      } catch (error) {
        console.error(
          "Error fetching movie details:",
          error
        );
      }
    };

    fetchMovieDetails();

  }, [id, type]);

  if (!movie) {
    return (
      <Loading text="Loading Movie Details..." />
    );
  }

  const movieId = movie.imdbID || movie.id;

  return (
    <div
      className="page-container"
      style={{
        background: "#0d1117",
        color: "#fff",
        minHeight: "100vh",
      }}
    >

      <MovieInfo movie={movie} />

      <Cast actors={movie.Actors} />

      <Trailer trailer={trailer} />

      <ReviewForm
        movieId={movieId}
      />

      <ReviewList
        movieId={movieId}
        reviews={reviews}
        setReviews={setReviews}
      />

    </div>
  );
};

export default MovieDetails;