import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loginImage from "../../assets/login-movie.png";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

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

            <div className="input-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

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