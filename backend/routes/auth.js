const express = require("express");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const User = require("../models/User");
const Review = require("../models/Review");

const router = express.Router();

const tmdbApiKey = process.env.TMDB_API_KEY;

// =====================================================
// SIGNUP
// =====================================================

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      email,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, 1 number and 1 special character",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      firstName,
      lastName,
      dob,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Signup Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =====================================================
// GET USER PROFILE
// =====================================================

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("firstName lastName dob email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
});

// =====================================================
// UPDATE PROFILE
// =====================================================

router.put("/profile/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      email,
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          dob,
          email: email.toLowerCase(),
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      ).select(
        "firstName lastName dob email"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
});

// =====================================================
// ADD RECENTLY VIEWED
// =====================================================

router.post(
  "/recently-viewed",
  async (req, res) => {
    try {
      const {
        userId,
        movieId,
      } = req.body;

      if (!userId || !movieId) {
        return res.status(400).json({
          success: false,
          message:
            "userId and movieId are required",
        });
      }

      const user =
        await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.recentlyViewed =
        user.recentlyViewed.filter(
          (item) =>
            String(item.movieId) !==
            String(movieId)
        );

      user.recentlyViewed.unshift({
        movieId: String(movieId),
        viewedAt: new Date(),
      });

      user.recentlyViewed =
        user.recentlyViewed.slice(0, 10);

      await user.save();

      res.json({
        success: true,
        message:
          "Recently viewed updated",
        recentlyViewed:
          user.recentlyViewed,
      });
    } catch (error) {
      console.error(
        "Recently Viewed Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);
// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put("/change-password/:id", async (req, res) => {
  try {
    const { password } = req.body;

    // ---------------------------------------------
    // VALIDATE PASSWORD
    // ---------------------------------------------

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    // Same password rules as SIGNUP
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, 1 number and 1 special character",
      });
    }

    // ---------------------------------------------
    // FIND USER
    // ---------------------------------------------

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ---------------------------------------------
    // HASH NEW PASSWORD
    // ---------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ---------------------------------------------
    // UPDATE PASSWORD
    // ---------------------------------------------

    user.password = hashedPassword;

    await user.save();

    // ---------------------------------------------
    // SUCCESS RESPONSE
    // ---------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error(
      "Change Password Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to change password",
    });
  }
});

// =====================================================
// GET RECENTLY VIEWED
// =====================================================

router.get(
  "/recently-viewed/:userId",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.userId
        ).select("recentlyViewed");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        recentlyViewed:
          user.recentlyViewed || [],
      });
    } catch (error) {
      console.error(
        "Get Recently Viewed Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// =====================================================
// UPDATE PREFERENCES
// =====================================================

router.put(
  "/preferences/:id",
  async (req, res) => {
    try {
      const {
        genres,
        language,
        industries,
        minRating,
        contentType,
      } = req.body;

      const languages = Array.isArray(
        language
      )
        ? language
        : language
        ? [language]
        : ["English"];

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            preferences: {
              genres: Array.isArray(genres)
                ? genres
                : [],

              language: languages,

              industries:
                Array.isArray(industries)
                  ? industries
                  : [],

              minRating:
                minRating !== undefined
                  ? Number(minRating)
                  : 7,

              contentType:
                contentType || "Both",
            },
          },
          {
            returnDocument: "after",
            runValidators: true,
          }
        ).select("preferences");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message:
          "Preferences updated successfully",

        preferences:
          user.preferences,
      });
    } catch (error) {
      console.error(
        "Update Preferences Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to save preferences",
      });
    }
  }
);

// =====================================================
// GET PREFERENCES
// =====================================================

router.get(
  "/preferences/:id",
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        ).select("preferences");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const preferences =
        user.preferences || {};

      res.json({
        success: true,

        preferences: {
          genres:
            preferences.genres || [],

          language:
            Array.isArray(
              preferences.language
            )
              ? preferences.language
              : preferences.language
              ? [preferences.language]
              : ["English"],

          industries:
            preferences.industries || [],

          minRating:
            preferences.minRating || 7,

          contentType:
            preferences.contentType ||
            "Both",
        },
      });
    } catch (error) {
      console.error(
        "Get Preferences Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch preferences",
      });
    }
  }
);

// =====================================================
// PERSONALIZED RECOMMENDATIONS
// =====================================================

router.get(
  "/recommendations/:userId",
  async (req, res) => {
    try {
      const { userId } = req.params;

      // =================================================
      // GET USER
      // =================================================

      const user =
        await User.findById(userId).select(
          "preferences recentlyViewed"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // =================================================
      // USER PREFERENCES
      // =================================================

      const preferences =
        user.preferences || {};

      const genres =
        Array.isArray(preferences.genres)
          ? preferences.genres
          : [];

      const languages =
        Array.isArray(
          preferences.language
        )
          ? preferences.language
          : preferences.language
          ? [preferences.language]
          : ["English"];

      const industries =
        Array.isArray(
          preferences.industries
        )
          ? preferences.industries
          : [];

      const minRating =
        Number(
          preferences.minRating || 7
        );

      const contentType =
        preferences.contentType ||
        "Both";

      // =================================================
      // LANGUAGE MAP
      // =================================================

      const languageMap = {
        English: "en",
        Hindi: "hi",
        Telugu: "te",
        Tamil: "ta",
        Malayalam: "ml",
        Kannada: "kn",
        Bengali: "bn",
        Korean: "ko",
        Japanese: "ja",
        Spanish: "es",
      };

      const selectedLanguageCodes =
        languages
          .map(
            (language) =>
              languageMap[language]
          )
          .filter(Boolean);

      // =================================================
      // GENRE MAP
      // =================================================

      const genreMap = {
        Action: 28,
        Adventure: 12,
        Animation: 16,
        Comedy: 35,
        Drama: 18,
        Horror: 27,
        Romance: 10749,
        Thriller: 53,
        "Sci-Fi": 878,
        Fantasy: 14,
      };

      const selectedGenreIds =
        genres
          .map(
            (genre) =>
              genreMap[genre]
          )
          .filter(Boolean);

      // =================================================
      // INDUSTRY MAP
      // =================================================
      //
      // NOTE:
      // TMDB does not provide a direct
      // "Bollywood/Tollywood" filter.
      //
      // We therefore use origin countries.
      //
      // India -> Bollywood / Tollywood etc.
      // US -> Hollywood
      // Korea -> Korean cinema
      //
      // =================================================

      const industryCountryMap = {
        Bollywood: "IN",
        Tollywood: "IN",
        Kollywood: "IN",
        Mollywood: "IN",
        Sandalwood: "IN",
        Hollywood: "US",
      };

      const selectedCountries =
        industries
          .map(
            (industry) =>
              industryCountryMap[
                industry
              ]
          )
          .filter(Boolean);

      // =================================================
      // RECENTLY VIEWED
      // =================================================

      const recentlyViewed =
        user.recentlyViewed || [];

      // =================================================
      // USER REVIEWS
      // =================================================

      const userReviews =
        await Review.find({
          user: userId,
        }).select(
          "movieId rating"
        );

      const likedMovieIds =
        userReviews
          .filter(
            (review) =>
              review.rating >= 4
          )
          .map((review) =>
            String(review.movieId)
          );

      const dislikedMovieIds =
        userReviews
          .filter(
            (review) =>
              review.rating <= 2
          )
          .map((review) =>
            String(review.movieId)
          );

      // =================================================
      // TMDB HELPER
      // =================================================

      const getTMDB = async (
        endpoint,
        params = {}
      ) => {
        const response =
          await axios.get(
            `https://api.themoviedb.org/3${endpoint}`,
            {
              params: {
                api_key:
                  tmdbApiKey,
                ...params,
              },
            }
          );

        return response.data;
      };

      // =================================================
      // DISCOVER MOVIES
      // =================================================

      let recommendations = [];

      const shouldGetMovies =
        contentType === "Movies" ||
        contentType === "Both";

      const shouldGetSeries =
        contentType === "Series" ||
        contentType === "Both";

      // =================================================
      // DISCOVER MOVIES BY PREFERENCES
      // =================================================

      if (shouldGetMovies) {
        try {
          const movieResponse =
            await getTMDB(
              "/discover/movie",
              {
                language: "en-US",

                sort_by:
                  "popularity.desc",

                vote_average_gte:
                  minRating,

                with_genres:
                  selectedGenreIds.length
                    ? selectedGenreIds.join("|")
                    : undefined,

                with_original_language:
                  selectedLanguageCodes.length
                    ? selectedLanguageCodes.join("|")
                    : undefined,

                with_origin_country:
                  selectedCountries.length
                    ? selectedCountries.join("|")
                    : undefined,

                include_adult: false,

                page: 1,
              }
            );

          recommendations.push(
            ...(movieResponse.results || [])
              .map((movie) => ({
                ...movie,
                media_type: "movie",
              }))
          );
        } catch (error) {
          console.error(
            "Movie Discover Error:",
            error.response?.data ||
              error.message
          );
        }
      }

      // =================================================
      // DISCOVER TV SERIES
      // =================================================

      if (shouldGetSeries) {
        try {
          const tvResponse =
            await getTMDB(
              "/discover/tv",
              {
                language: "en-US",

                sort_by:
                  "popularity.desc",

                vote_average_gte:
                  minRating,

                with_genres:
                  selectedGenreIds.length
                    ? selectedGenreIds.join("|")
                    : undefined,

                with_original_language:
                  selectedLanguageCodes.length
                    ? selectedLanguageCodes.join("|")
                    : undefined,

                with_origin_country:
                  selectedCountries.length
                    ? selectedCountries.join("|")
                    : undefined,

                include_adult: false,

                page: 1,
              }
            );

          recommendations.push(
            ...(tvResponse.results || [])
              .map((show) => ({
                ...show,
                media_type: "tv",
              }))
          );
        } catch (error) {
          console.error(
            "TV Discover Error:",
            error.response?.data ||
              error.message
          );
        }
      }

      // =================================================
      // ALSO GET RECOMMENDATIONS FROM RECENTLY VIEWED
      // =================================================

      for (
        const item of recentlyViewed.slice(
          0,
          5
        )
      ) {
        try {
          // Movie recommendations
          if (
            shouldGetMovies
          ) {
            const response =
              await getTMDB(
                `/movie/${item.movieId}/recommendations`,
                {
                  language: "en-US",
                  page: 1,
                }
              );

            recommendations.push(
              ...(response.results || [])
                .map((movie) => ({
                  ...movie,
                  media_type:
                    "movie",
                }))
            );
          }

          // TV recommendations
          if (
            shouldGetSeries
          ) {
            const response =
              await getTMDB(
                `/tv/${item.movieId}/recommendations`,
                {
                  language: "en-US",
                  page: 1,
                }
              );

            recommendations.push(
              ...(response.results || [])
                .map((show) => ({
                  ...show,
                  media_type:
                    "tv",
                }))
            );
          }
        } catch (error) {
          // Some IDs are movies and some are TV IDs.
          // If one endpoint fails, continue.
          console.log(
            `Recently viewed recommendation error for ${item.movieId}:`,
            error.response?.data ||
              error.message
          );
        }
      }

      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const seenIds = new Set();

      let uniqueMovies = [];

      for (
        const movie of recommendations
      ) {
        if (!movie?.id) continue;

        const uniqueKey =
          `${movie.media_type}-${movie.id}`;

        if (
          !seenIds.has(uniqueKey)
        ) {
          seenIds.add(uniqueKey);

          uniqueMovies.push(movie);
        }
      }

      // =================================================
      // REMOVE RECENTLY VIEWED
      // =================================================

      const recentlyViewedIds =
        new Set(
          recentlyViewed.map(
            (item) =>
              String(item.movieId)
          )
        );

      uniqueMovies =
        uniqueMovies.filter(
          (movie) =>
            !recentlyViewedIds.has(
              String(movie.id)
            )
        );

      // =================================================
      // REMOVE ALREADY REVIEWED
      // =================================================

      const reviewedMovieIds =
        new Set(
          userReviews.map(
            (review) =>
              String(review.movieId)
          )
        );

      uniqueMovies =
        uniqueMovies.filter(
          (movie) =>
            !reviewedMovieIds.has(
              String(movie.id)
            )
        );

      // =================================================
      // HARD LANGUAGE FILTER
      // =================================================
      //
      // This is important.
      //
      // If user selected Hindi + Telugu,
      // English content is removed.
      //
      // =================================================

      if (
        selectedLanguageCodes.length > 0
      ) {
        uniqueMovies =
          uniqueMovies.filter(
            (movie) =>
              selectedLanguageCodes.includes(
                movie.original_language
              )
          );
      }

      // =================================================
      // HARD RATING FILTER
      // =================================================

      uniqueMovies =
        uniqueMovies.filter(
          (movie) =>
            Number(
              movie.vote_average || 0
            ) >= minRating
        );

      // =================================================
      // HARD GENRE FILTER
      // =================================================

      if (
        selectedGenreIds.length > 0
      ) {
        uniqueMovies =
          uniqueMovies.filter(
            (movie) =>
              movie.genre_ids?.some(
                (id) =>
                  selectedGenreIds.includes(
                    id
                  )
              )
          );
      }

      // =================================================
      // HARD CONTENT TYPE FILTER
      // =================================================

      if (
        contentType === "Movies"
      ) {
        uniqueMovies =
          uniqueMovies.filter(
            (movie) =>
              movie.media_type ===
              "movie"
          );
      }

      if (
        contentType === "Series"
      ) {
        uniqueMovies =
          uniqueMovies.filter(
            (movie) =>
              movie.media_type ===
              "tv"
          );
      }

      // =================================================
      // INDUSTRY FILTER
      // =================================================
      //
      // Since Bollywood/Tollywood etc.
      // are not separate TMDB fields,
      // India is used as the country.
      //
      // =================================================

      if (
        selectedCountries.length > 0
      ) {
        uniqueMovies =
          uniqueMovies.filter(
            (movie) => {
              const originCountries =
                movie.origin_country ||
                [];

              return originCountries.some(
                (country) =>
                  selectedCountries.includes(
                    country
                  )
              );
            }
          );
      }

      // =================================================
      // SCORE MOVIES
      // =================================================

      uniqueMovies =
        uniqueMovies.map(
          (movie) => {
            let score = 0;

            // -------------------------------------------
            // TMDB rating
            // -------------------------------------------

            score +=
              Number(
                movie.vote_average || 0
              ) * 2;

            // -------------------------------------------
            // Genre bonus
            // -------------------------------------------

            if (
              movie.genre_ids?.some(
                (id) =>
                  selectedGenreIds.includes(
                    id
                  )
              )
            ) {
              score += 10;
            }

            // -------------------------------------------
            // Language bonus
            // -------------------------------------------

            if (
              selectedLanguageCodes.includes(
                movie.original_language
              )
            ) {
              score += 10;
            }

            // -------------------------------------------
            // Industry bonus
            // -------------------------------------------

            if (
              movie.origin_country?.some(
                (country) =>
                  selectedCountries.includes(
                    country
                  )
              )
            ) {
              score += 8;
            }

            // -------------------------------------------
            // User liked movie bonus
            // -------------------------------------------

            if (
              likedMovieIds.includes(
                String(movie.id)
              )
            ) {
              score += 15;
            }

            // -------------------------------------------
            // User disliked movie penalty
            // -------------------------------------------

            if (
              dislikedMovieIds.includes(
                String(movie.id)
              )
            ) {
              score -= 20;
            }

            return {
              ...movie,
              recommendationScore:
                score,
            };
          }
        );

      // =================================================
      // SORT
      // =================================================

      uniqueMovies.sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      );

      // =================================================
      // FORMAT MOVIES
      // =================================================

      const movies =
        uniqueMovies
          .slice(0, 20)
          .map((movie) => ({
            id: movie.id,

            title:
              movie.title ||
              movie.name ||
              "Untitled",

            year:
              movie.release_date
                ? movie.release_date.split(
                    "-"
                  )[0]
                : movie.first_air_date
                ? movie.first_air_date.split(
                    "-"
                  )[0]
                : "N/A",

            rating:
              Number(
                movie.vote_average || 0
              ),

            poster:
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/300x450?text=No+Image",

            overview:
              movie.overview ||
              "No overview available",

            type:
              movie.media_type === "tv"
                ? "series"
                : "movie",

            language:
              movie.original_language ||
              "N/A",

            industries:
              movie.origin_country ||
              [],
          }));

      // =================================================
      // RESPONSE
      // =================================================

      res.json({
        success: true,

        preferences: {
          genres,

          language:
            languages,

          industries,

          minRating,

          contentType,
        },

        movies,
      });
    } catch (error) {
      console.error(
        "Recommendations Error:",
        error.response?.data ||
          error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to generate recommendations",
      });
    }
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;