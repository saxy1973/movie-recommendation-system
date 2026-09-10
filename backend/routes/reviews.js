const express = require("express");
const Review = require("../models/Review");

const router = express.Router();


// =========================
// ADD REVIEW
// =========================

router.post("/", async (req, res) => {
  try {
    const { userId, movieId, rating, comment } = req.body;

    if (!userId || !movieId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "userId, movieId, rating and comment are required",
      });
    }

    const existingReview = await Review.findOne({
      user: userId,
      movieId: movieId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this movie",
      });
    }

    const review = await Review.create({
      user: userId,
      movieId: movieId,
      rating: rating,
      comment: comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (error) {
    console.error("Add Review Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// UPDATE REVIEW
// =========================

router.put("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "userId, rating and comment are required",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });

  } catch (error) {
    console.error("Update Review Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// DELETE REVIEW
// =========================

router.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!deletedReview) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error("Delete Review Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// GET REVIEWS BY USER
// IMPORTANT: KEEP BEFORE /:movieId
// =========================

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({
      user: userId,
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error(
      "Get User Reviews Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// =========================
// GET REVIEWS FOR A MOVIE
// =========================

router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { userId } = req.query;

    const reviews = await Review.find({
      movieId: movieId,
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });


    // Current user's review first
    if (userId) {
      reviews.sort((a, b) => {

        const aIsCurrentUser =
          String(a.user?._id) === String(userId);

        const bIsCurrentUser =
          String(b.user?._id) === String(userId);

        if (aIsCurrentUser && !bIsCurrentUser) {
          return -1;
        }

        if (!aIsCurrentUser && bIsCurrentUser) {
          return 1;
        }

        return 0;
      });
    }


    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error(
      "Get Reviews Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;