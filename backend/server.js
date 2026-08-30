require("dotenv").config();
const fs = require("fs");

const connectDB = require("./config/db");

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
  console.log("TMDB Item:", item);

  const title = item.title || item.name || "Untitled";
  const year =
    (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
  const type = item.media_type === "tv" ? "series" : "movie";

  const movie = {
    imdbID: String(item.id),
    Title: title,
    Year: year,
    Poster: buildPosterUrl(item.poster_path),
    Type: type,
    Rating: item.vote_average,
    Overview: item.overview || "No overview available",
  };

  console.log("Normalized:", movie);

  return movie;
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
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/top_rated",
      {
        params: {
          api_key: tmdbApiKey,
          language: "en-US",
          page: 1,
        },
        timeout: 10000, // 10 seconds
      }
    );

    const movies = response.data.results.map(normalizeMovie);

    res.json({
      success: true,
      movies,
    });

  } catch (error) {
    console.error("========== TOP RATED ERROR ==========");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("=====================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/featured", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day",
      {
        params: {
          api_key: tmdbApiKey,
        },
      }
    );

    const movie = response.data.results.find(
      (m) => m.backdrop_path && m.poster_path
    );

    res.json({
      success: true,
      movie: {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        rating: movie.vote_average,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/trending", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/movie/day",
      {
        params: {
          api_key: tmdbApiKey,
        },
      }
    );

    const movies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date?.split("-")[0],
      rating: movie.vote_average,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
    }));

    res.json({
      success: true,
      movies,
    });

  } catch (error) {
    console.log("Trending Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/coming-soon", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming",
      {
        params: {
          api_key: tmdbApiKey,
        },
      }
    );

    const movies = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date?.split("-")[0],
      rating: movie.vote_average,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/300x450?text=No+Image",
    }));

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.log("Coming Soon Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const theaterRoutes = require("./routes/theaters");

app.use("/api/theaters", theaterRoutes);

const trailerRoutes = require("./routes/trailer");

app.use("/api/trailer", trailerRoutes);

const PORT = 5000;

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");

app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

