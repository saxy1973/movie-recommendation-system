const express = require("express");
const Wishlist = require("../models/Wishlist");

const router = express.Router();

// Add movie to wishlist
router.post("/add", async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({
        success: false,
        message: "userId and movieId are required",
      });
    }

    const alreadyExists = await Wishlist.findOne({
      user: userId,
      movieId: movieId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Movie already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      movieId: movieId,
    });

    res.status(201).json({
      success: true,
      message: "Movie added to wishlist",
      wishlist,
    });

  } catch (error) {
    console.error("Wishlist Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// Get user's wishlist
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({
      user: userId,
    });

    res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {
    console.error("Get Wishlist Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Remove movie from wishlist
router.delete("/:userId/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    const deletedMovie = await Wishlist.findOneAndDelete({
      user: userId,
      movieId: movieId,
    });

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie removed from wishlist",
    });

  } catch (error) {
    console.error("Delete Wishlist Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Toggle movie in wishlist
router.post("/toggle", async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({
        success: false,
        message: "userId and movieId are required",
      });
    }

    // Check if movie already exists
    const existingMovie = await Wishlist.findOne({
      user: userId,
      movieId: movieId,
    });

    // Already exists → remove
    if (existingMovie) {
      await Wishlist.findOneAndDelete({
        user: userId,
        movieId: movieId,
      });

      return res.status(200).json({
        success: true,
        isWishlisted: false,
        message: "Movie removed from wishlist",
      });
    }

    // Doesn't exist → add
    const wishlist = await Wishlist.create({
      user: userId,
      movieId: movieId,
    });

    return res.status(201).json({
      success: true,
      isWishlisted: true,
      message: "Movie added to wishlist",
      wishlist,
    });

  } catch (error) {
    console.error("Wishlist Toggle Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;