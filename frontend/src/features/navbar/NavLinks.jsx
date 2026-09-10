import { useNavigate, useLocation } from "react-router-dom";

const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHome = () => {
    if (location.pathname === "/") {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate("/", {
  state: {
    scrollTo: "home",
  },
});
    }
  };

  const goToTopRated = () => {
    if (location.pathname === "/") {
      document.getElementById("top-rated")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
     navigate("/", {
  state: {
    scrollTo: "top-rated",
  },
});
    }
  };

  const goToComingSoon = () => {
  if (location.pathname === "/") {
    document.getElementById("coming-soon")?.scrollIntoView({
      behavior: "smooth",
    });
  } else {
    navigate("/", {
  state: {
    scrollTo: "coming-soon",
  },
});
  }
};

const goToTrending = () => {
  if (location.pathname === "/") {
    document.getElementById("trending")?.scrollIntoView({
      behavior: "smooth",
    });
  } else {
    navigate("/", {
      state: {
        scrollTo: "trending",
      },
    });
  }
};
const goToTheaters = () => {
  navigate("/theaters");
};

const goToContact = () => {
  navigate("/contact");
};

  return (
    <ul className="nav-links">
      <li onClick={goToHome}>Home</li>

      <li onClick={goToTopRated}>Top Rated</li>

      <li onClick={goToComingSoon}>Coming Soon</li>

      <li onClick={goToTrending}>Trending</li>
      
      <li onClick={goToTheaters}>Theaters</li>
      
      <li onClick={goToContact}>Contact Us</li>
    </ul>
  );
};

export default NavLinks;