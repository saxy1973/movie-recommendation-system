import { useEffect, useState } from "react";
import api from "../../services/api";
import "./WishlistButton.css";

const WishlistButton = ({ movieId }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  const getStoredUser = () => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Parse Error:", error);
      return null;
    }
  };

  // ==========================================
  // CHECK WHETHER MOVIE IS ALREADY WISHLISTED
  // ==========================================
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const user = getStoredUser();

        if (!user) return;

        const userId = user.id || user._id;

        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const response = await api.get(
          `/wishlist/${userId}`
        );

        if (response.data.success) {
          const exists = response.data.wishlist.some(
            (item) =>
              String(item.movieId) === String(movieId)
          );

          setIsWishlisted(exists);
        }
      } catch (error) {
        console.error(
          "Check Wishlist Error:",
          error
        );
      }
    };

    checkWishlist();
  }, [movieId]);

  // ==========================================
  // ADD / REMOVE MOVIE FROM WISHLIST
  // ==========================================
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const user = getStoredUser();

    // User is not logged in
    if (!user) {
      alert("Please login to use wishlist");
      return;
    }

    const userId = user.id || user._id;

    if (!userId) {
      alert("User information not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/wishlist/toggle",
        {
          userId,
          movieId,
        }
      );

      if (response.data.success) {
        setIsWishlisted(
          response.data.isWishlisted
        );
      }
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BOOKMARK UI
  // ==========================================
  return (
    <button
      type="button"
      className={`wishlist-icon ${
        isWishlisted ? "wishlisted" : ""
      }`}
      onClick={handleWishlist}
      disabled={loading}
      title={
        isWishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"
      }
      aria-label={
        isWishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="bookmark-svg"
        aria-hidden="true"
      >
        <path
          d="
            M6 3.5
            C6 2.67 6.67 2 7.5 2
            H16.5
            C17.33 2 18 2.67 18 3.5
            V22
            L12 18.5
            L6 22
            V3.5
            Z
          "
        />
      </svg>
    </button>
  );
};

export default WishlistButton;