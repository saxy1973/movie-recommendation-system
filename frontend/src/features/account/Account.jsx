import { useNavigate } from "react-router-dom";
import "./Account.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Account = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    reviews: 0,
    wishlist: 0,
    recentlyViewed: 0,
  });

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const name = user?.firstName || "Bhumika";

  // =========================================
  // FETCH ACCOUNT STATS
  // =========================================

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.id) return;

        // =====================================
        // REVIEWS
        // =====================================

        const reviewResponse = await api.get(
          `/reviews/user/${user.id}`
        );

        const reviews =
          reviewResponse.data.success
            ? reviewResponse.data.reviews || []
            : [];

        // =====================================
        // WISHLIST
        // Get directly from database/API
        // =====================================

        const wishlistResponse = await api.get(
          `/wishlist/${user.id}`
        );

        const wishlist =
          wishlistResponse.data.success
            ? wishlistResponse.data.wishlist || []
            : [];

        // =====================================
        // RECENTLY VIEWED
        // =====================================

        const recentlyViewed =
          JSON.parse(
            localStorage.getItem("recentlyViewed")
          ) || [];

        // =====================================
        // SET STATS
        // =====================================

        setStats({
          reviews: reviews.length,
          wishlist: wishlist.length,
          recentlyViewed: recentlyViewed.length,
        });

      } catch (error) {
        console.error(
          "Error fetching account stats:",
          error
        );
      }
    };

    fetchStats();
  }, [user?.id]);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/login");
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="account-page">

      {/* HEADER */}

      <div className="account-header">

        <h1 className="account-title">
          Your Space ✨
        </h1>

        <p className="account-subtitle">
          Manage your profile, reviews and movie preferences.
        </p>

      </div>


      {/* MAIN LAYOUT */}

      <div className="account-layout">

        {/* =====================================
            LEFT MENU
        ===================================== */}

        <div className="account-menu">

          {/* Personal Information */}

          <div
            className="account-menu-item active"
            onClick={() =>
              navigate("/account/PersonalInformation")
            }
          >

            <span className="account-menu-icon">
              👤
            </span>

            <div>

              <h3>
                Personal Information
              </h3>

              <p>
                Your profile details
              </p>

            </div>

          </div>


          {/* Wishlist */}

          <div
            className="account-menu-item"
            onClick={() =>
              navigate("/wishlist")
            }
          >

            <span className="account-menu-icon">
              ❤️
            </span>

            <div>

              <h3>
                Wishlist
              </h3>

              <p>
                Movies you want to watch
              </p>

            </div>

          </div>


          {/* My Reviews */}

          <div
            className="account-menu-item"
            onClick={() =>
              navigate("/account/MyReviews")
            }
          >

            <span className="account-menu-icon">
              ⭐
            </span>

            <div>

              <h3>
                My Reviews
              </h3>

              <p>
                Your movie reviews
              </p>

            </div>

          </div>


          {/* Recently Viewed */}

          <div
            className="account-menu-item"
            onClick={() =>
              navigate("/account/RecentlyViewed")
            }
          >

            <span className="account-menu-icon">
              🕐
            </span>

            <div>

              <h3>
                Recently Viewed
              </h3>

              <p>
                Movies you explored
              </p>

            </div>

          </div>


          {/* My Preferences */}

          <div
            className="account-menu-item"
            onClick={() =>
              navigate("/account/MyPreferences")
            }
          >

            <span className="account-menu-icon">
              🎯
            </span>

            <div>

              <h3>
                My Preferences
              </h3>

              <p>
                Your movie taste
              </p>

            </div>

          </div>


          {/* Logout */}

          <div
            className="account-menu-item logout-item"
            onClick={handleLogout}
          >

            <span className="account-menu-icon">
              ↪️
            </span>

            <div>

              <h3>
                Logout
              </h3>

              <p>
                Sign out from Movira
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            RIGHT PROFILE CARD
        ===================================== */}

        <div className="account-profile">

          {/* PROFILE AVATAR */}

          <div className="profile-avatar">
            👤
          </div>


          {/* NAME */}

          <h2>
            {name}
          </h2>


          {/* TAGLINE */}

          <p className="profile-tagline">
            Movie lover & explorer 🎬
          </p>


          {/* ===================================
              STATS
          =================================== */}

          <div className="profile-stats">

            {/* REVIEWS */}

            <div className="profile-stat">

              <span className="stat-icon">
                🎬
              </span>

              <strong>
                {stats.reviews}
              </strong>

              <small>
                Reviews
              </small>

            </div>


            {/* WISHLIST */}

            <div className="profile-stat">

              <span className="stat-icon">
                💗
              </span>

              <strong>
                {stats.wishlist}
              </strong>

              <small>
                Wishlist
              </small>

            </div>


            {/* RECENTLY VIEWED */}

            <div className="profile-stat">

              <span className="stat-icon">
                🕐
              </span>

              <strong>
                {stats.recentlyViewed}
              </strong>

              <small>
                Recently Viewed
              </small>

            </div>

          </div>


          {/* DIVIDER */}

          <div className="profile-divider"></div>


          {/* WELCOME MESSAGE */}

          <div className="profile-welcome">

            <span>
              🍿
            </span>

            <p>
              Welcome to your personal movie space.
              <br />
              Keep exploring, reviewing and
              <br />
              discovering something new!
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Account;