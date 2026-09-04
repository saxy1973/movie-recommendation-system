const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// =========================================
// SIGNUP
// =========================================

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      email,
      password,
    } = req.body;


    // Check required fields

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


    // Check password

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, 1 number and 1 special character",
      });
    }


    // Check existing user

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }


    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // Create user

    const user = await User.create({
      firstName,
      lastName,
      dob,
      email: email.toLowerCase(),
      password: hashedPassword,
    });


    // Response

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


// =========================================
// LOGIN
// =========================================

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // Check fields

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }


    // Find user

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


    // Compare password

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


    // Login successful

    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
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


module.exports = router;