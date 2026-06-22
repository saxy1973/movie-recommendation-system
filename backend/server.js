require("dotenv").config();
const fs = require("fs");

console.log("API Key:", process.env.OMDB_API_KEY);
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

const movies = JSON.parse(
  fs.readFileSync("./data/movies.json", "utf8")
);

console.log(movies);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Movie Recommendation Backend Running 🚀"
  });
});
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;

    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`
    );

    res.json(response.data);

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

    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movieId}`
    );

    res.json(response.data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching movie details"
    });
  }
});

app.get("/api/recommend/:title", (req, res) => {
  const movieTitle = req.params.title;

  const selectedMovie = movies.find(
    movie => movie.Title.toLowerCase() === movieTitle.toLowerCase()
  );

  if (!selectedMovie) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

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
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});