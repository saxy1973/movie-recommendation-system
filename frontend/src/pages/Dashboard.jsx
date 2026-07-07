import { useEffect, useState } from "react";

import Hero from "../features/hero";
import TopRated from "../features/top-rated/TopRatedMovies";
import Trending from "../features/trending/Trending";
import ComingSoon from "../features/comingsoon/ComingSoon";

import { getTopRatedMovies } from "../services/movieService";

const Dashboard = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
       const data = await getTopRatedMovies();
       setTopRatedMovies(data.movies);
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      }
    };

    fetchTopRated();
  }, []);

console.log(topRatedMovies);

return (
  <>
    <Hero />
    <TopRated movies={topRatedMovies} />

<Trending />

<ComingSoon />
  </>
);
};

export default Dashboard;