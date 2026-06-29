import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/movieService";
import MovieInfo from "../features/movie-details/MovieInfo";
import Trailer from "../features/movie-details/Trailer";

import Cast from "../features/movie-details/Cast";

import ReviewForm from "../features/movie-details/ReviewForm";

import ReviewList from "../features/movie-details/ReviewList";

import TheaterSection from "../features/movie-details/TheaterSection";

import Loading from "../features/loading";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) {
  return (
    <Loading text="Loading Movie Details..." />
  );
}

  return (
  <div
  className="page-container"
  style={{
    background: "#0d1117",
    color: "#fff",
    minHeight: "100vh",
  }}
>
    {/* Movie Information */}
    <MovieInfo movie={movie} />

    {/* Top Cast */}
    <Cast actors={movie.Actors} />
    {/* Trailer */}
    <Trailer />
    {/* In Theaters */}
    <TheaterSection />
    {/* Review Form */}
    <ReviewForm />
    {/* Review List */}
    <ReviewList />
  </div>
);
};

export default MovieDetails;