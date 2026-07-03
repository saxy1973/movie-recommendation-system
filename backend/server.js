require("dotenv").config();
const fs = require("fs");

const tmdbApiKey = process.env.TMDB_API_KEY;
console.log("TMDB API Key loaded:", Boolean(tmdbApiKey));

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf8"));

const fallbackPoster = "https://placehold.co/300x450?text=No+Image";

const buildPosterUrl = (posterPath) =>
  posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : fallbackPoster;

const normalizeMovie = (item) => {
  const title = item.title || item.name || "Untitled";
  const year =
    (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const type = item.media_type === "tv" ? "series" : "movie";

  return {
    imdbID: String(item.id),
    Title: title,
    Year: year,
    Poster: buildPosterUrl(item.poster_path),
    Type: type,
    Overview: item.overview || "No overview available"
  };
};

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Movie Recommendation Backend Running 🚀"
  });
});
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    if (!tmdbApiKey) {
      return res.status(500).json({
        success: false,
        message: "TMDB API key is not configured"
      });
    }

    const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
      params: {
        api_key: tmdbApiKey,
        query,
        include_adult: false,
        language: "en-US"
      }
    });

    const results = (response.data.results || [])
      .filter((item) => ["movie", "tv"].includes(item.media_type))
      .map(normalizeMovie);

    res.json({
      Search: results,
      totalResults: String(results.length),
      Response: "True"
    });
  } catch (error) {
    console.log(error.response?.data);
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/api/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!tmdbApiKey) {
      return res.status(500).json({
        success: false,
        message: "TMDB API key is not configured"
      });
    }

    const [movieResponse, creditsResponse] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: { api_key: tmdbApiKey, language: "en-US" }
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        params: { api_key: tmdbApiKey, language: "en-US" }
      })
    ]);

    const movie = movieResponse.data;
    const credits = creditsResponse.data;

    const director =
      credits.crew?.find((person) => person.job === "Director")?.name || "N/A";
    const actors =
      credits.cast?.slice(0, 10).map((person) => person.name).join(", ") || "N/A";
    const genres = movie.genres?.map((genre) => genre.name).join(", ") || "N/A";

    res.json({
      imdbID: String(movie.id),
      Title: movie.title,
      Year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
      Poster: buildPosterUrl(movie.poster_path),
      Type: "movie",
      Genre: genres,
      Director: director,
      Actors: actors,
      Plot: movie.overview || "No overview available",
      Runtime: movie.runtime ? `${movie.runtime} min` : "N/A"
    });
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching movie details"
    });
  }
});

app.get("/api/top-rated", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbApiKey}&language=en-US&page=1`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "TMDb request failed",
      });
    }

    const data = await response.json();

    const movies = data.results.map(normalizeMovie);

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
  const recommendations = movies
    .filter(movie => movie.Title !== selectedMovie.Title)
    .map(movie => {
      let score = 0;

      // Genre Match
      const selectedGenres = selectedMovie.Genre.split(", ");
      const movieGenres = movie.Genre.split(", ");

      if (selectedGenres.some(g => movieGenres.includes(g))) {
        score += 3;
      }

      // Director Match
      if (movie.Director === selectedMovie.Director) {
        score += 2;
      }

      // Actor Match
      const selectedActors = selectedMovie.Actors.split(", ");
      const movieActors = movie.Actors.split(", ");

      if (selectedActors.some(a => movieActors.includes(a))) {
        score += 1;
      }

      // Title Match
      const selectedWords = selectedMovie.Title.toLowerCase().split(" ");
      const movieWords = movie.Title.toLowerCase().split(" ");

      if (selectedWords.some(word => movieWords.includes(word))) {
        score += 1;
      }

      return {
        ...movie,
        score
      };
    })
    .sort((a, b) => b.score - a.score);

  res.json({
    selectedMovie,
    recommendations
  });





const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});