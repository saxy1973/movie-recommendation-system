import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../assets/login-movie.png";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

     if (response.data.success) {

  const user = JSON.stringify(response.data.user);

  if (staySignedIn) {
    localStorage.setItem("user", user);
    sessionStorage.removeItem("user");
  } else {
    sessionStorage.setItem("user", user);
    localStorage.removeItem("user");
  }

  alert("Login successful!");

  navigate("/");
}
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT IMAGE ================= */}

      <div className="login-image">

        <img
          src={loginImage}
          alt="Movira Cinema"
        />

        <div className="image-overlay">


        </div>

      </div>


      {/* ================= RIGHT LOGIN ================= */}

      <div className="login-form-section">

        <div className="login-box">

          {/* LOGO */}

          <div className="movira-logo">
            MOV<span>IRA</span>
          </div>


          {/* HEADING */}

          <h2>Login</h2>

          <p className="login-subtitle">
            Welcome back! Please login to your account.
          </p>


          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>


            {/* PASSWORD */}

{/* PASSWORD */}
<div className="input-group">

  <label htmlFor="password">
    Password
  </label>

  <div className="password-wrapper">

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        /* OPEN EYE */
        <svg
          viewBox="0 0 24 24"
          className="eye-icon"
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
          className="eye-icon"
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

</div>

{/* STAY SIGNED IN */}
<div className="stay-signed-in">

  <label>
    <input
      type="checkbox"
      checked={staySignedIn}
      onChange={(e) => setStaySignedIn(e.target.checked)}
    />

    <span>Stay signed in</span>
  </label>

</div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>


          {/* SIGN UP */}

          <p className="signup-text">
            Don't have an account?

            <span
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;