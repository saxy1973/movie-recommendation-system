import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../assets/login-movie.png";
import "./Signup.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least 8 characters, 1 number and 1 special character."
      );
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        firstName,
        lastName,
        dob,
        email,
        password,
      });

      console.log("Signup Response:", response.data);

      if (response.data.success) {
        alert("Account created successfully!");

        navigate("/login");
      }
    } catch (error) {
      console.error("Signup Error:", error);

      alert(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="signup-page">

      {/* =================================
          LEFT IMAGE
      ================================= */}

      <div className="signup-image">

        <img
          src={loginImage}
          alt="Movira Cinema"
        />

        <div className="signup-image-overlay">

        

        </div>

      </div>


      {/* =================================
          RIGHT SIGNUP FORM
      ================================= */}

      <div className="signup-form-section">

        <div className="signup-box">

          {/* LOGO */}

          <div className="signup-logo">
            MOV<span>IRA</span>
          </div>


          {/* HEADING */}

          <h2>Create Account</h2>

          <p className="signup-subtitle">
            Sign up to start your movie journey.
          </p>


          {/* =================================
              FORM
          ================================= */}

          <form onSubmit={handleSignup}>

            {/* FIRST NAME + LAST NAME */}

            <div className="signup-name-row">

              <div className="signup-input-group">

                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  required
                />

              </div>


              <div className="signup-input-group">

                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* DATE OF BIRTH */}

            <div className="signup-input-group">

              <label htmlFor="dob">
                Date of Birth
              </label>

              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) =>
                  setDob(e.target.value)
                }
                required
              />

            </div>


            {/* EMAIL */}

            <div className="signup-input-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

{/* PASSWORD */}
<div className="signup-input-group">

  <label htmlFor="password">
    Password
  </label>

  <div className="signup-password-wrapper">

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Create your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="signup-password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={
        showPassword ? "Hide password" : "Show password"
      }
    >
      {showPassword ? (
        /* OPEN EYE */
        <svg
          viewBox="0 0 24 24"
          className="signup-eye-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        /* CLOSED EYE */
        <svg
          viewBox="0 0 24 24"
          className="signup-eye-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.3 18.3 0 0 1-3.1 4.2" />
          <path d="M6.1 6.1C3.5 8.1 2 12 2 12s3.5 8 10 8c1.8 0 3.4-.5 4.8-1.2" />
        </svg>
      )}
    </button>

  </div>

  <small className="signup-password-hint">
    Minimum 8 characters, 1 number and 1 special character
  </small>

</div>

            {/* SIGN UP BUTTON */}

            <button
              type="submit"
              className="signup-button"
            >
              Sign Up
            </button>

          </form>


          {/* =================================
              SIGN IN
          ================================= */}

          <p className="signup-signin-text">

            Already have an account?

            <span
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;