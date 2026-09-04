import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../features/hero";
import TopRated from "../features/top-rated/TopRatedMovies";
import Trending from "../features/wishlist/trending/Trending";
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

  // Scroll to section when URL contains a hash
useEffect(() => {
  if (loadingTopRated) return;

  const section = location.state?.scrollTo;

  if (section) {
    const element = document.getElementById(section);

    if (element) {
      const navbarHeight = 90;

      window.scrollTo({
        top: element.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    }
  }
}, [location, loadingTopRated]);

  return (
    <>
      <Hero />

      <TopRated movies={topRatedMovies} />

      <ComingSoon />

      <Trending />
    </>
  );
};

export default Dashboard;