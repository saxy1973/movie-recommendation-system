import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../features/hero";
import TopRated from "../features/top-rated/TopRatedMovies";
import Trending from "../features/trending/Trending";
import ComingSoon from "../features/comingsoon/ComingSoon";

import { getTopRatedMovies } from "../services/movieService";

const Dashboard = () => {
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  const location = useLocation();

  // Fetch Top Rated Movies
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const data = await getTopRatedMovies();
        setTopRatedMovies(data.movies);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchTopRated();
  }, []);

  // Handle section scrolling
  useEffect(() => {
    const section = location.state?.scrollTo;

    // Normal page visit → always go to top
    if (!section) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
      return;
    }

    // Wait until dashboard content is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById(section);

      if (!element) return;

      const navbarHeight = 90;

      const elementTop =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - navbarHeight,
        left: 0,
        behavior: "smooth",
      });

      // Remove scrollTo state so it doesn't trigger again
      window.history.replaceState({}, document.title);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Hero />
    </>
  );
};

export default Dashboard;