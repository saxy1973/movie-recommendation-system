const HeroContent = () => {
  return (
    <div className="hero-content">

      {/* Hero Tags */}
      <div className="hero-tags">

        <div className="tag">
          🔍 Smart Search
        </div>

        <div className="tag">
          ⭐ Movie Recommendations
        </div>

        <div className="tag">
          🔥 Trending Movies
        </div>

        <div className="tag">
          📍 Nearby Theaters
        </div>

      </div>

      {/* Heading */}
   <h1 className="hero-title">
  Discover Your Next Favorite
  <br />
  Movie with
  <br />
  Smart Recommendations
</h1>

      {/* Description */}
      <p className="hero-description">
        From trending blockbusters to hidden gems,
        discover movies based on your interests with
        smart recommendations and comprehensive
        movie details.
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

        <small className="search-text">
          Search your favorite movies here
        </small>

        <div className="search-box">

          <input
            type="text"
            placeholder="🔍 Search your favorite movies..."
          />

          <button className="search-btn">
            Search
          </button>

        </div>

      </div>

    </div>
  );
};

export default HeroContent;