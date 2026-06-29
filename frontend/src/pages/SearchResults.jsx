import { useLocation } from "react-router-dom";
import { MovieGrid } from "../features/movies";
import "./SearchResults.css";

const SearchResults = () => {
  const { state } = useLocation();

  const movies = state?.movies || [];
  const query = state?.query || "";

  return (
    <section className="search-results-page">

      <div className="search-results-container">

        {movies.length === 0 ? (
          <p className="no-results">
            No movies found.
          </p>
        ) : (
          <MovieGrid movies={movies} />
        )}

      </div>

    </section>
  );
};

export default SearchResults;