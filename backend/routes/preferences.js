const express = require("express");
const User = require("../models/User");

const router = express.Router();

// =========================
// GET USER PREFERENCES
// =========================

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("preferences");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      preferences: user.preferences,
    });

  } catch (error) {
    console.error("Get Preferences Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// =========================
// SAVE / UPDATE PREFERENCES
// =========================

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      genres,
      language,
      industries,
      minRating,
      contentType,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Make sure language is always an array
    let languages = [];

    if (Array.isArray(language)) {
      languages = language;
    } else if (language) {
      languages = [language];
    }

    // If nothing is selected, default to English
    if (languages.length === 0) {
      languages = ["English"];
    }

    user.preferences = {
      genres: Array.isArray(genres) ? genres : [],
      language: languages,
      industries: Array.isArray(industries) ? industries : [],
      minRating: Number(minRating) || 7,
      contentType: contentType || "Both",
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Preferences saved successfully",
      preferences: user.preferences,
    });

  } catch (error) {
    console.error("Save Preferences Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;