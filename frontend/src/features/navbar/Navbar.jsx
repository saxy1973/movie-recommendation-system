import "./navbar.css";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  return (
    <nav className="navbar">

      <Logo />

      <NavLinks />

      <div className="nav-right">

        {/* Recommendations */}
        <button
          className="recommendations-btn"
          onClick={() => navigate("/recommendations")}
        >
          Recommendations
        </button>


        {/* Account */}
        <button
          className="account-btn"
          onClick={() => navigate("/account")}
        >
          <span className="account-icon">
            <FontAwesomeIcon icon={faUser} />
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