import { useState } from "react";
import api from "../../services/api";
import "./contact.css";

const Contact = () => {
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
  // HANDLE INPUT
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
  // RESET FORM
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
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.data.success) {
        setSuccess(
          "Your message has been sent successfully! ✉️"
        );

        resetForm();
      }
    } catch (error) {
      console.error("Contact Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REQUEST CALLBACK
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
          "Your call back request has been sent! 📞"
        );

        resetForm();
      }
    } catch (error) {
      console.error("Callback Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to send call back request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-container">

        {/* =====================================
            LEFT SIDE - FORM
        ===================================== */}

        <div className="contact-left">

          <div className="contact-heading">


            <h1>
              Let's Talk
              <span> 🎬</span>
            </h1>

            <p>
              Have a question, feedback, or just want
              to talk movies? We'd love to hear from you.
            </p>

          </div>


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


          {/* FORM */}

          <form className="contact-form">

            {/* NAME */}

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


            {/* EMAIL */}

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


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
                <span className="optional">
                  Optional
                </span>
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            {/* SUBJECT */}

            <div className="form-group">

              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
              />

            </div>


            {/* MESSAGE */}

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


            {/* BUTTONS */}

            <div className="contact-buttons">

              <button
                type="button"
                className="send-message-btn"
                onClick={handleMessage}
                disabled={loading}
              >

                {loading
                  ? "Sending..."
                  : "Send Message  ✉️"}

              </button>


              <button
                type="button"
                className="callback-btn"
                onClick={handleCallback}
                disabled={loading}
              >

                {loading
                  ? "Sending..."
                  : "Request a Call Back  📞"}

              </button>

            </div>

          </form>

        </div>


        {/* =====================================
            RIGHT SIDE - MOVIRA INFO
        ===================================== */}

        <div className="contact-right">

          <div className="about-card">

            {/* TOP */}

            <div className="about-header">

              <div className="about-icon">
                🎬
              </div>

              <div>
                <span className="about-label">
                  WELCOME TO
                </span>

                <h2>
                  Movira
                </h2>
              </div>

            </div>


            {/* DIVIDER */}

            <div className="about-line"></div>


            {/* DESCRIPTION */}

            <p className="about-description">
              Your personal movie discovery space.
              Explore trending movies, discover
              highly rated films, find upcoming
              releases and get personalized
              recommendations — all in one place.
            </p>


            {/* FEATURES */}

            <div className="movira-features">

              <div className="feature-item">

                <span className="feature-icon">
                  🔥
                </span>

                <div>
                  <h4>
                    Trending Movies
                  </h4>

                  <p>
                    Discover what's popular right now.
                  </p>
                </div>

              </div>


              <div className="feature-item">

                <span className="feature-icon">
                  ⭐
                </span>

                <div>
                  <h4>
                    Top Rated
                  </h4>

                  <p>
                    Find movies loved by viewers.
                  </p>
                </div>

              </div>


              <div className="feature-item">

                <span className="feature-icon">
                  🎯
                </span>

                <div>
                  <h4>
                    Personalized
                  </h4>

                  <p>
                    Get recommendations made for you.
                  </p>
                </div>

              </div>

            </div>


            {/* CONTACT INFO */}

            <div className="contact-info-box">

              <div className="info-item">

                <div className="info-icon">
                  ✉️
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    moviraprojo123@gmail.com
                  </strong>
                </div>

              </div>


              <div className="info-item">

                <div className="info-icon">
                  📍
                </div>

                <div>
                  <span>
                    Location
                  </span>

                  <strong>
                    New Delhi, India
                  </strong>
                </div>

              </div>


              <div className="info-item">

                <div className="info-icon">
                  ⏱️
                </div>

                <div>
                  <span>
                    Response Time
                  </span>

                  <strong>
                    Usually within 24 hours
                  </strong>
                </div>

              </div>

            </div>


            {/* BOTTOM MESSAGE */}

            <div className="about-footer">

              <span>
                🍿
              </span>

              <p>
                Your feedback helps us make
                Movira better.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;