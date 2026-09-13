import { useState } from "react";
import api from "../../services/api";
import "./contact.css";

const Contact = () => {

  const [activeOption, setActiveOption] =
    useState("message");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };


  // ==========================================
  // RESET
  // ==========================================

  const resetForm = () => {

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleMessage = async (e) => {

    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {

      setError(
        "Please fill all required fields."
      );

      setLoading(false);

      return;
    }

    try {

      const response = await api.post(
        "/contact",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );

      if (response.data.success) {

        setSuccess(
          "Your message reached Movira! ✨"
        );

        resetForm();
      }

    } catch (error) {

      console.error(
        "Contact Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to send message."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // CALLBACK
  // ==========================================

  const handleCallback = async () => {

    setLoading(true);
    setSuccess("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {

      setError(
        "Please enter your name and phone number."
      );

      setLoading(false);

      return;
    }

    try {

      const response = await api.post(
        "/contact/callback",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message:
            formData.message ||
            "User requested a call back from Movira.",
        }
      );

      if (response.data.success) {

        setSuccess(
          "Call back request sent! We'll get in touch. 📞"
        );

        resetForm();
      }

    } catch (error) {

      console.error(
        "Callback Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to send callback request."
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // CHANGE OPTION
  // ==========================================

  const changeOption = (option) => {

    setActiveOption(option);

    setError("");
    setSuccess("");
  };


  return (

    <div className="contact-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="contact-heading">

        <span className="contact-small-title">
          CONNECT WITH MOVIRA
        </span>

        <h1>
          Let's Talk <span>🎬</span>
        </h1>

        <p>
          Whether you have a question, feedback,
          or just want to talk movies — we're here.
        </p>

      </div>


      {/* ====================================
          INTERACTIVE CONTACT AREA
      ==================================== */}

      <div className="contact-container">


        {/* ==================================
            LEFT OPTIONS
        ================================== */}

        <div className="contact-options">


          {/* MESSAGE */}

          <button
            type="button"
            className={`contact-option ${
              activeOption === "message"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeOption("message")
            }
          >

            <div className="option-icon">
              ✉️
            </div>

            <div className="option-text">

              <h3>
                Send a Message
              </h3>

              <p>
                Questions, feedback or suggestions
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* CALLBACK */}

          <button
            type="button"
            className={`contact-option ${
              activeOption === "callback"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeOption("callback")
            }
          >

            <div className="option-icon">
              📞
            </div>

            <div className="option-text">

              <h3>
                Request a Call Back
              </h3>

              <p>
                Leave your number and we'll call you
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* EMAIL */}

          <button
            type="button"
            className={`contact-option ${
              activeOption === "email"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeOption("email")
            }
          >

            <div className="option-icon">
              💌
            </div>

            <div className="option-text">

              <h3>
                Email Movira
              </h3>

              <p>
                Reach us directly
              </p>

            </div>

            <span className="option-arrow">
              →
            </span>

          </button>


          {/* LITTLE BRAND BOX */}

          <div className="contact-mini-card">

            <span>
              🍿
            </span>

            <div>
              <strong>
                Every story matters.
              </strong>

              <p>
                Your feedback helps us make
                Movira better.
              </p>
            </div>

          </div>

        </div>


        {/* ==================================
            RIGHT CONTENT
        ================================== */}

        <div className="contact-content">


          {/* SUCCESS */}

          {success && (
            <div className="contact-success">
              {success}
            </div>
          )}


          {/* ERROR */}

          {error && (
            <div className="contact-error">
              {error}
            </div>
          )}


          {/* =================================
              MESSAGE PANEL
          ================================= */}

          {activeOption === "message" && (

            <div className="contact-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  ✉️
                </div>

                <div>
                  <span>
                    CONTACT US
                  </span>

                  <h2>
                    Tell us what's on your mind
                  </h2>
                </div>

              </div>


              <form
                className="contact-form"
                onSubmit={handleMessage}
              >

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Your Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Optional"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Message
                  </label>

                  <textarea
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                  />

                </div>


                <button
                  type="submit"
                  className="panel-submit"
                  disabled={loading}
                >

                  {loading
                    ? "Sending..."
                    : "Send Message ✨"}

                </button>

              </form>

            </div>

          )}


          {/* =================================
              CALLBACK PANEL
          ================================= */}

          {activeOption === "callback" && (

            <div className="contact-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  📞
                </div>

                <div>

                  <span>
                    CALL BACK
                  </span>

                  <h2>
                    We'd love to call you
                  </h2>

                </div>

              </div>


              <p className="panel-description">
                Enter your details and our team
                will get in touch with you.
              </p>


              <div className="form-group">

                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Email
                  <span className="optional">
                    Optional
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>
                  Message
                  <span className="optional">
                    Optional
                  </span>
                </label>

                <textarea
                  name="message"
                  placeholder="Anything you'd like us to know?"
                  value={formData.message}
                  onChange={handleChange}
                />

              </div>


              <button
                type="button"
                className="panel-submit"
                onClick={handleCallback}
                disabled={loading}
              >

                {loading
                  ? "Sending..."
                  : "Request a Call Back 📞"}

              </button>

            </div>

          )}


          {/* =================================
              EMAIL PANEL
          ================================= */}

          {activeOption === "email" && (

            <div className="email-panel">

              <div className="email-glow">
                💌
              </div>

              <span className="email-label">
                SAY HELLO
              </span>

              <h2>
                We'd love to
                <span> hear from you.</span>
              </h2>

              <p>
                For direct enquiries, feedback,
                collaboration or anything movie-related,
                drop us an email.
              </p>


              <div className="official-email">

                <span>
                  ✉️
                </span>

                <div>

                  <small>
                    OFFICIAL EMAIL
                  </small>

                  <strong>
                    moviraprojo123@gmail.com
                  </strong>

                </div>

              </div>


              <a
                href="mailto:moviraprojo123@gmail.com"
                className="email-button"
              >
                Open Email ✨
              </a>


              <div className="email-footer">
                <span>
                  🍿
                </span>

                <p>
                  Every great movie starts
                  with a conversation.
                </p>
              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Contact;