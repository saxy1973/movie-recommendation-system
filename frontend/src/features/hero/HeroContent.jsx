import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/movieService";

const HeroContent = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const data = await searchMovies(query);

     navigate("/search-results", {
  state: {
    movies: data.Search || [],
    query: query,
  },
});
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  return (
    <div className="hero-content">

      {/* Hero Tags */}
      <div className="hero-tags">
        <div className="tag">🔍 Smart Search</div>

        <div className="tag">
          ⭐ Movie Recommendations
        </div>

        <div className="tag">🔥 Trending Movies</div>

        <div className="tag">📍 Nearby Theaters</div>
      </div>

      {/* Heading */}
      <h1 className="hero-title">
        Your Ultimate Movies 
        <br/>
        & Web Series 
        <br/>Explorer
   
      </h1>

      {/* Description */}
      <p className="hero-description">
        From trending blockbusters to hidden gems, explore movies and web series with smart recommendations, detailed information, and everything you need to discover your next favorite title.
      </p>

      {/* Buttons */}
      <div className="hero-buttons">
        <button className="primary-btn">
          Explore Movies
        </button>

        <button className="secondary-btn">
          AI Assistant
        </button>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder=" Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroContent;