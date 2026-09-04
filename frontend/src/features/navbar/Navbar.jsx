import "./navbar.css";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <nav className="navbar">

      <Logo />

      <NavLinks />

      <div className="nav-right">

        {/* Wishlist */}
        <button
          className="wishlist-btn"
          onClick={() => navigate("/wishlist")}
        >
          ♡ Wishlist
        </button>


        {/* User */}
        <button
          className="account-btn"
          onClick={() => navigate("/profile")}
        >
          <span className="account-icon"  >
            👤
          </span>

          <span>
            Hey, {user?.firstName || "User"}
          </span>
        </button>

      </div>

    </nav>
  );
};

export default Navbar;