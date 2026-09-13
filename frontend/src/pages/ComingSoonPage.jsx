import { useEffect, useMemo, useState } from "react";

import ComingSoon from "../features/comingsoon/ComingSoon";
import { getComingSoonMovies } from "../services/movieService";
import {
  filterMovies,
  getDefaultFilters,
} from "../services/movieFilterService";

const ComingSoonPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(
    getDefaultFilters()
  );

  useEffect(() => {
    const fetchComingSoon = async () => {
      try {
        const data = await getComingSoonMovies();

        setMovies(data.movies || []);
      } catch (error) {
        console.error(
          "Coming Soon Movies Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComingSoon();
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
      <div className="coming-page-loading">
        <div className="coming-loading-spinner"></div>

        <p>
          Loading Coming Soon Movies...
        </p>
      </div>
    );
  }

  return (
    <ComingSoon
      movies={filteredMovies}
      filters={filters}
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
    />
  );
};

export default ComingSoonPage;