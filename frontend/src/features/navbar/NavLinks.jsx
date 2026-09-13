import { useNavigate } from "react-router-dom";

const NavLinks = () => {
  const navigate = useNavigate();

  return (
    <ul className="nav-links">
      
      {/* Home */}
      <li onClick={() => navigate("/")}>
        Home
      </li>

      {/* Top Rated */}
      <li onClick={() => navigate("/top-rated")}>
        Top Rated
      </li>

      {/* Coming Soon */}
      <li onClick={() => navigate("/coming-soon")}>
        Coming Soon
      </li>

      {/* Trending */}
      <li onClick={() => navigate("/trending")}>
        Trending
      </li>

      {/* Theaters */}
      <li onClick={() => navigate("/theaters")}>
        Theaters
      </li>

      {/* Contact */}
      <li onClick={() => navigate("/contact")}>
        Contact Us
      </li>

    </ul>
  );
};

export default NavLinks;