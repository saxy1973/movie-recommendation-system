const express = require("express");
const nodemailer = require("nodemailer");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();


// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// =====================================================
// SEND NORMAL CONTACT MESSAGE
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;


    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required",
      });
    }


    // =================================================
    // SAVE MESSAGE TO DATABASE
    // =================================================

    const contactMessage =
      await ContactMessage.create({
        name,
        email,
        subject,
        message,
        type: "message",
      });


    // =================================================
    // SEND EMAIL TO OFFICIAL MOVIRA EMAIL
    // =================================================

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: "moviraprojo123@gmail.com",

      replyTo: email,

      subject: `Movira Contact: ${subject}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 25px;
          background: #f5f5f5;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
          ">

            <h2 style="color: #d629ff;">
              🎬 New Message from Movira
            </h2>

            <hr />

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Email:</strong>
              ${email}
            </p>

            <p>
              <strong>Subject:</strong>
              ${subject}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p style="
              background: #f4f4f4;
              padding: 15px;
              border-radius: 8px;
            ">
              ${message}
            </p>

            <hr />

            <p style="color: #777;">
              This message was sent from the Movira Contact Us page.
            </p>

          </div>

        </div>
      `,
    });


    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully!",
      contactMessage,
    });

  } catch (error) {

    console.error(
      "Contact Message Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to send message. Please try again.",
    });
  }
});


// =====================================================
// REQUEST A CALL BACK
// =====================================================

router.post("/callback", async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      message,
    } = req.body;


    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Name and phone number are required",
      });
    }


    // =================================================
    // SAVE CALLBACK REQUEST
    // =================================================

    const callbackRequest =
      await ContactMessage.create({

        name,

        email: email || "",

        phone,

        subject: "Call Back Request",

        message:
          message ||
          "User requested a call back from Movira.",

        type: "callback",
      });


    // =================================================
    // SEND EMAIL
    // =================================================

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: "moviraprojo123@gmail.com",

      replyTo: email || process.env.EMAIL_USER,

      subject: "📞 New Movira Call Back Request",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 25px;
          background: #f5f5f5;
        ">

          <div style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
          ">

            <h2 style="color: #d629ff;">
              📞 New Call Back Request
            </h2>

            <hr />

            <p>
              <strong>Name:</strong>
              ${name}
            </p>

            <p>
              <strong>Phone:</strong>
              ${phone}
            </p>

            ${
              email
                ? `
                  <p>
                    <strong>Email:</strong>
                    ${email}
                  </p>
                `
                : ""
            }

            <p>
              <strong>Message:</strong>
            </p>

            <p style="
              background: #f4f4f4;
              padding: 15px;
              border-radius: 8px;
            ">
              ${
                message ||
                "Please call me back."
              }
            </p>

            <hr />

            <p style="color: #777;">
              This call back request was submitted
              from the Movira Contact Us page.
            </p>

          </div>

        </div>
      `,
    });


    res.status(201).json({

      success: true,

      message:
        "Your call back request has been sent successfully!",

      callbackRequest,
    });

  } catch (error) {

    console.error(
      "Callback Request Error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to send call back request. Please try again.",
    });
  }
});


module.exports = router;