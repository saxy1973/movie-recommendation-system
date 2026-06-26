import { useLocation } from "react-router-dom";
import { MovieGrid } from "../features/movies";

const SearchResults = () => {
  const { state } = useLocation();

  const movies = state?.movies || [];
  const query = state?.query || "";

  return (
    <div
      style={{
        background: "#0d1117",
        color: "white",
        minHeight: "100vh",
        padding: "120px 80px",
      }}
    >
      <h1>Search Results</h1>

      <h3 style={{ margin: "20px 0 40px" }}>
        Results for:{" "}
        <span style={{ color: "#ff4d6d" }}>
          {query}
        </span>
      </h3>

      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default SearchResults;