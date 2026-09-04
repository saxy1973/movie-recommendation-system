import { useEffect, useState } from "react";
import api from "../../services/api";
import "./WishlistButton.css";

const WishlistButton = ({ movieId }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Check whether movie is already wishlisted
  // ==========================================
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        const response = await api.get(
          `/wishlist/${user.id}`
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
  // Add / Remove movie from wishlist
  // ==========================================
  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const storedUser = localStorage.getItem("user");

    // User is not logged in
    if (!storedUser) {
      alert("Please login to use wishlist");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setLoading(true);

      const response = await api.post(
        "/wishlist/toggle",
        {
          userId: user.id,
          movieId: movieId,
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
  // Bookmark UI
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
    >
      <svg
        viewBox="0 0 24 24"
        className="bookmark-svg"
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