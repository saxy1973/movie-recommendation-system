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

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const LANGUAGE_MAP = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  ko: "Korean",
  ja: "Japanese",
  es: "Spanish",
};

const getIndustry = (language) => {
  switch (language) {
    case "hi":
      return "Bollywood";

    case "te":
      return "Tollywood";

    case "ta":
      return "Kollywood";

    case "ml":
      return "Mollywood";

    case "kn":
      return "Sandalwood";

    case "en":
      return "Hollywood";

    default:
      return "Hollywood";
  }
};

const getTrendingIndustry = (movie) => {
  const language = movie.original_language;

  if (language === "hi") return "Bollywood";
  if (language === "te") return "Tollywood";
  if (language === "ta") return "Kollywood";
  if (language === "ml") return "Mollywood";
  if (language === "kn") return "Sandalwood";

  if (language === "en") return "Hollywood";

  return "";
};

const normalizeMovie = (item) => {
  const title =
    item.title ||
    item.name ||
    "Untitled";

  const year =
    (
      item.release_date ||
      item.first_air_date ||
      ""
    ).split("-")[0] || "N/A";

  const type =
    item.media_type === "tv"
      ? "series"
      : "movie";

  const languageCode =
    item.original_language || "";

  const language =
    LANGUAGE_MAP[languageCode] ||
    languageCode;

  const genres =
    item.genre_ids
      ?.map((id) => GENRE_MAP[id])
      .filter(Boolean)
      .join(", ") || "N/A";

  const industry =
    getIndustry(languageCode);

  return {
    imdbID: String(item.id),
    Title: title,
    Year: year,
    Poster: buildPosterUrl(item.poster_path),
    Type: type,
    Rating: item.vote_average,
    Overview:
      item.overview ||
      "No overview available",

    Genre: genres,
    Language: language,
    Industry: industry,
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
    const type = req.query.type || "movie";

    if (!tmdbApiKey) {
      return res.status(500).json({
        success: false,
        message: "TMDB API key is not configured",
      });
    }

    const endpoint =
      type === "series"
        ? `https://api.themoviedb.org/3/tv/${movieId}`
        : `https://api.themoviedb.org/3/movie/${movieId}`;

    const creditsEndpoint =
      type === "series"
        ? `https://api.themoviedb.org/3/tv/${movieId}/credits`
        : `https://api.themoviedb.org/3/movie/${movieId}/credits`;

    const [detailsResponse, creditsResponse] =
      await Promise.all([
        axios.get(endpoint, {
          params: {
            api_key: tmdbApiKey,
            language: "en-US",
          },
        }),

        axios.get(creditsEndpoint, {
          params: {
            api_key: tmdbApiKey,
            language: "en-US",
          },
        }),
      ]);

    const item = detailsResponse.data;
    const credits = creditsResponse.data;

    // =========================================
    // COMMON DATA
    // =========================================

    const title =
      item.title ||
      item.name ||
      "Untitled";

    const year =
      (
        item.release_date ||
        item.first_air_date ||
        ""
      ).split("-")[0] || "N/A";

    const genres =
      item.genres
        ?.map((genre) => genre.name)
        .join(", ") || "N/A";

    const actors =
      credits.cast
        ?.slice(0, 10)
        .map((person) => person.name)
        .join(", ") || "N/A";

    const director =
      type === "movie"
        ? credits.crew?.find(
            (person) =>
              person.job === "Director"
          )?.name || "N/A"
        : "N/A";

    // =========================================
    // SERIES SPECIFIC
    // =========================================

    const seasons =
      type === "series"
        ? item.number_of_seasons || 0
        : null;

    const episodes =
      type === "series"
        ? item.number_of_episodes || 0
        : null;

    const runtime =
      type === "movie"
        ? item.runtime
          ? `${item.runtime} min`
          : "N/A"
        : item.episode_run_time?.length
        ? `${item.episode_run_time[0]} min/episode`
        : "N/A";

    // =========================================
    // RESPONSE
    // =========================================

    res.json({
      success: true,

      imdbID: String(item.id),

      Title: title,

      Year: year,

      Poster: buildPosterUrl(
        item.poster_path
      ),

      // IMPORTANT
      Type: type,

      Rating: item.vote_average,

      Genre: genres,

      Language:
        item.spoken_languages
          ?.map((lang) => lang.english_name)
          .join(", ") || "N/A",

      Country:
        item.production_countries
          ?.map((country) => country.name)
          .join(", ") || "N/A",

      Director: director,

      Actors: actors,

      Plot:
        item.overview ||
        "No overview available",

      Runtime: runtime,

      Seasons: seasons,

      Episodes: episodes,

      Status: item.status || "N/A",
    });

  } catch (error) {
    console.error(
      "Movie/Series Details Error:",
      error.response?.data ||
        error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Error fetching movie/series details",
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

   const movies = response.data.results.map((movie) => {
  const normalized = normalizeMovie(movie);

  return {
    ...normalized,
    Industry: getTrendingIndustry(movie),
  };
});

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.log(
      "Trending Error:",
      error.response?.data || error.message
    );

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
          language: "en-US",
          page: 1,
        },
      }
    );

    const movies = response.data.results.map((movie) =>
      normalizeMovie(movie)
    );

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.log(
      "Coming Soon Error:",
      error.response?.data || error.message
    );

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

const preferencesRoutes = require("./routes/preferences");

app.use("/api/preferences", preferencesRoutes);

const recentlyViewedRoutes =
  require("./routes/recentlyViewed");

  app.use(
  "/api/recently-viewed",
  recentlyViewedRoutes
);

const contactRoutes = require("./routes/contact");
app.use("/api/contact", contactRoutes);
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Movira",
  },
});

app.post("/api/assistant", async (req, res) => {
  try {
    // ==========================================
    // GET REQUEST DATA
    // ==========================================

    let { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ==========================================
    // CLEAN MESSAGE
    // ==========================================

    message = message.trim();

    // ==========================================
    // DETECT REQUESTED LANGUAGE
    // ==========================================

    const lowerMessage = message.toLowerCase();

    let language = null;

    if (lowerMessage.includes("hindi")) {
      language = "Hindi";
    } else if (lowerMessage.includes("bengali")) {
      language = "Bengali";
    } else if (lowerMessage.includes("tamil")) {
      language = "Tamil";
    } else if (lowerMessage.includes("telugu")) {
      language = "Telugu";
    } else if (lowerMessage.includes("malayalam")) {
      language = "Malayalam";
    } else if (lowerMessage.includes("kannada")) {
      language = "Kannada";
    } else if (lowerMessage.includes("marathi")) {
      language = "Marathi";
    } else if (lowerMessage.includes("punjabi")) {
      language = "Punjabi";
    }

    // ==========================================
    // LANGUAGE INSTRUCTION
    // ==========================================

    const languageInstruction = language
      ? `
IMPORTANT LANGUAGE REQUIREMENT:

The user is asking for ${language} movies.

Recommend ONLY movies originally made in ${language}.

Do NOT recommend movies merely because they have a ${language} dub.

If a movie was originally made in another language, DO NOT include it.
`
      : "";

    // ==========================================
    // PREPARE CONVERSATION HISTORY
    // ==========================================

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (msg) =>
              msg &&
              (msg.role === "user" ||
                msg.role === "assistant") &&
              typeof msg.content === "string" &&
              msg.content.trim()
          )
          .slice(-20)
      : [];

    console.log("====================================");
    console.log("MOVIRA AI REQUEST");
    console.log("MESSAGE:", message);
    console.log(
      "HISTORY LENGTH:",
      conversationHistory.length
    );
    console.log("====================================");

    // ==========================================
    // SYSTEM PROMPT
    // ==========================================

    const systemPrompt = `
You are Movira AI Assistant, a friendly and helpful movie and web-series assistant.

You help users with:

- Movie recommendations
- Web-series recommendations
- Hindi, Bollywood and Indian movies
- Movies similar to a given movie
- Movie storylines and plots
- Actors, directors and movie details
- Genres
- Ratings
- Release years
- General movie questions

${languageInstruction}

==========================================
CONVERSATION RULES
==========================================

1. ALWAYS use the conversation history before answering the latest user message.

2. The latest user message is the current request and MUST be answered directly.

3. Remember movies and web-series mentioned earlier in the conversation.

4. If the user uses:
   - it
   - this movie
   - that movie
   - its story
   - storyline of it
   - plot of it
   - ending
   - cast
   - director
   - rating
   - year

   identify the movie from the most recently discussed or selected movie.

5. NEVER randomly change the movie being discussed.

6. If the user asks for recommendations:
   - Give actual recommendations immediately.
   - Do NOT give a generic greeting.
   - Do NOT ask what genre they like if they already asked for recommendations.

7. If the user asks for movies similar to a movie:
   - Recommend movies genuinely similar to that movie.
   - Consider genre, tone, story style, romance, characters, family themes and overall feel.
   - Do NOT randomly recommend unrelated movies.

==========================================
LANGUAGE RULE
==========================================

If the user asks for:

Hindi movies:
ONLY recommend movies originally made in Hindi.

Bengali movies:
ONLY recommend movies originally made in Bengali.

Tamil movies:
ONLY recommend movies originally made in Tamil.

Telugu movies:
ONLY recommend movies originally made in Telugu.

Malayalam movies:
ONLY recommend movies originally made in Malayalam.

Kannada movies:
ONLY recommend movies originally made in Kannada.

Marathi movies:
ONLY recommend movies originally made in Marathi.

Punjabi movies:
ONLY recommend movies originally made in Punjabi.

A dubbed movie does NOT count as an originally made movie in that language.

==========================================
TOP PICK RULE
==========================================

Whenever giving multiple recommendations:

- Give ONE Top Pick.
- The Top Pick MUST be number 1.
- Every movie MUST have a number.
- Every movie MUST have a release year.

Correct format:

1. Kuch Kuch Hota Hai (1998) — TOP PICK — Romantic family drama with friendship and love.

2. Dil To Pagal Hai (1997) — Musical romantic drama.

3. Hum Aapke Hain Koun (1994) — Warm family romance.

4. Veer-Zaara (2004) — Emotional romantic drama.

5. Jab We Met (2007) — Feel-good romantic comedy.

==========================================
NUMBER SELECTION RULE
==========================================

The frontend may convert a numbered selection into a direct movie question.

If the user sends only:

1

2

3

4

5

etc.

and the conversation contains a recommendation list, interpret that number as the selected movie from the most recent recommendation list.

NEVER replace the selected movie with another movie.

NEVER randomly choose a different movie.

If the frontend already sends:

Tell me about the movie "Kuch Kuch Hota Hai" (1998)

then answer specifically about Kuch Kuch Hota Hai.

==========================================
FOLLOW-UP RULE
==========================================

If the user asks:

- story
- storyline
- story line
- plot
- storyline of it
- plot of it
- year
- release year
- cast
- actors
- director
- rating
- ending

answer about the MOST RECENTLY selected or discussed movie.

If a movie was selected immediately before, "it" refers to that movie.

Do NOT ask the user to repeat the movie name when the context already identifies it.

==========================================
STORY RULE
==========================================

If the user asks for storyline/story/plot:

- Explain the actual story.
- Do NOT give only cast information.
- Do NOT replace the storyline with unrelated information.
- Avoid major spoilers unless the user specifically asks for spoilers.

==========================================
RECOMMENDATION FORMAT
==========================================

Whenever giving multiple movie recommendations ALWAYS use:

1. Movie Title (Year) — TOP PICK — Short reason.

2. Movie Title (Year) — Short reason.

3. Movie Title (Year) — Short reason.

4. Movie Title (Year) — Short reason.

5. Movie Title (Year) — Short reason.

Rules:

- Every recommendation MUST have a number.
- Every recommendation MUST include the release year.
- Number 1 MUST be the Top Pick.
- Do NOT put Top Pick outside the numbered list.
- Do NOT invent movie titles.
- Do NOT randomly change movies.
- Follow requested language strictly.

==========================================
GENERAL STYLE
==========================================

- Be friendly.
- Be conversational.
- Be reasonably concise.
- Answer the user's actual question.
- Avoid unnecessary spoilers.
- If the user asks something unrelated to movies/web-series, politely guide them back to Movira.

==========================================
IMPORTANT CONTEXT RULE
==========================================

The conversation history is the source of context.

The most recently selected movie has priority when resolving:

"it"

"this movie"

"that movie"

"story"

"storyline"

"plot"

"year"

"cast"

"director"

"rating"

Never treat every user message as a completely new conversation.
`;

    // ==========================================
    // OPENROUTER REQUEST
    // ==========================================

    const response =
      await openai.chat.completions.create({
        model: "openrouter/free",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },

          ...conversationHistory,

          {
            role: "user",
            content: message,
          },
        ],
      });

    // ==========================================
    // GET AI REPLY
    // ==========================================

    const reply =
      response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response.",
      });
    }

    // ==========================================
    // LOG RESPONSE
    // ==========================================

    console.log("====================================");
    console.log("MOVIRA AI RESPONSE:");
    console.log(reply);
    console.log("====================================");

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("====================================");
    console.error("MOVIRA AI ERROR");
    console.error("MESSAGE:", error.message);
    console.error(
      "STATUS:",
      error.status || error.response?.status
    );
    console.error(
      "DATA:",
      error.response?.data || error
    );
    console.error("====================================");

    // ==========================================
    // RATE LIMIT
    // ==========================================

    const status =
      error.status ||
      error.response?.status;

    if (status === 429) {
      return res.status(429).json({
        success: false,
        rateLimited: true,
        message:
          "AI daily limit has been reached. Please try again later.",
      });
    }

    // ==========================================
    // OTHER API ERROR
    // ==========================================

    return res.status(500).json({
      success: false,
      rateLimited: false,
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "AI Assistant failed to respond.",
    });
  }
});

const PORT = 5000;

const authRoutes = require("./routes/auth");
const wishlistRoutes = require("./routes/wishlist");
const reviewRoutes = require("./routes/reviews");

app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

