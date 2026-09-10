const express = require("express");
const User = require("../models/User");

const router = express.Router();


// =========================
// ADD RECENTLY VIEWED MOVIE
// =========================

router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Same movie ko duplicate hone se roko
    user.recentlyViewed = user.recentlyViewed.filter(
      (movie) => String(movie.movieId) !== String(movieId)
    );

    // Sabse recent movie beginning me
    user.recentlyViewed.unshift({
      movieId: String(movieId),
      viewedAt: new Date(),
    });

    // Maximum 20 movies
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Recently viewed updated",
      recentlyViewed: user.recentlyViewed,
    });

  } catch (error) {
    console.error(
      "Add Recently Viewed Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// GET RECENTLY VIEWED
// =========================

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "recentlyViewed"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      recentlyViewed: user.recentlyViewed,
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
});


module.exports = router;