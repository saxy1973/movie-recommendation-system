import "./navbar.css";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Logo />

      <NavLinks />

      <div className="nav-right">
        <select className="language">
          <option>English</option>
          <option>Hindi</option>
        </select>

        <button className="signin-btn">
          Sign In
        </button>
      </div>
    </nav>
  );
};

export default Navbar;