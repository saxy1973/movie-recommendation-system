const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // WISHLIST
    // =========================

    wishlist: [
      {
        type: Number,
      },
    ],

    // =========================
    // PREFERENCES
    // =========================

    preferences: {
      // Multiple genres
      genres: {
        type: [String],
        default: [],
      },

      // Multiple languages
    language: {
  type: [String],
  default: ["English"],
},

      // Multiple industries
      industries: {
        type: [String],
        default: [],
      },

      // TMDB rating is out of 10
      minRating: {
        type: Number,
        default: 7,
        min: 1,
        max: 10,
      },

      // Movies / Series / Both
      contentType: {
        type: String,
        enum: ["Movies", "Series", "Both"],
        default: "Both",
      },
    },

    // =========================
    // RECENTLY VIEWED
    // =========================

    recentlyViewed: [
      {
        movieId: {
          type: String,
          required: true,
        },

        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);