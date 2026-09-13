import { useEffect, useMemo, useState } from "react";

import Trending from "../features/trending/Trending";
import { getTrendingMovies } from "../services/movieService";
import {
  filterMovies,
  getDefaultFilters,
} from "../services/movieFilterService";

const TrendingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(
    getDefaultFilters()
  );

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingMovies();

        setMovies(data.movies || []);
      } catch (error) {
        console.error("Trending Movies Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
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
        <p>Loading Trending Movies...</p>
      </div>
    );
  }

  return (
    <Trending
      movies={filteredMovies}
      filters={filters}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
    />
  );
};

export default TrendingPage;