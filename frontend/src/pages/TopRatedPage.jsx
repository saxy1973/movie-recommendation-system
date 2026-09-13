import { useEffect, useMemo, useState } from "react";

import TopRated from "../features/top-rated/TopRatedMovies";
import { getTopRatedMovies } from "../services/movieService";
import {
  filterMovies,
  getDefaultFilters,
} from "../services/movieFilterService";

const TopRatedPage = () => {
  console.log("🔥 TOP RATED PAGE RUNNING");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(getDefaultFilters());

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const data = await getTopRatedMovies();

       console.log(
  "FIRST MOVIE FULL:",
  JSON.stringify(data.movies?.[0], null, 2)
);

        setMovies(data.movies || []);
      } catch (error) {
        console.error("Top Rated Movies Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  const filteredMovies = useMemo(() => {
    return filterMovies(movies, filters);
  }, [movies, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>

        <p>Loading Top Rated Movies...</p>
      </div>
    );
  }

  return (
    <TopRated
      movies={filteredMovies}
      filters={filters}
      setFilters={setFilters}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
    />
  );
};

export default TopRatedPage;