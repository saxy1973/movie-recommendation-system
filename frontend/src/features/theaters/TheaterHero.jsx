import CurrentLocation from "./CurrentLocation";
import SearchBar from "./SearchBar";
import RegionCard from "./RegionCard";
import regions from "./data";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const TheaterHero = ({
  setLoading,
  setError,
}) => {

  const navigate = useNavigate();

  const handleCityClick = async (city) => {

    try {

      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/theaters/city?city=${city}`
      );

      navigate("/theaters/results", {
        state: {
          theaters: res.data.theaters,
          city: city,
        },
      });

    } catch (err) {

      setError("Failed to fetch theaters.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="theater-hero">

      <div className="hero-overlay">

        <div className="hero-left">

          <span className="hero-badge">
            🎬 FIND CINEMAS
          </span>

          <h1 className="hero-title">
            The Best Screens
            <br />
            Closest to You
          </h1>

          <p className="hero-description">
            Discover nearby cinemas across India.
            Search by city or use your current
            location to explore theaters instantly.
          </p>

          <div className="search-card">

            <CurrentLocation
              setLoading={setLoading}
              setError={setError}
            />

            <div className="divider">
              <span>OR</span>
            </div>

            <SearchBar
              setLoading={setLoading}
              setError={setError}
            />

          </div>

        </div>

        <div className="hero-right">

          <div className="cities-panel">

            <h3 className="cities-title">
              Popular Cities
            </h3>

            <div className="cities-grid">

              {regions.map((region) => (

                <RegionCard
                  key={region.id}
                  city={region.city}
                  image={region.image}
                  onClick={handleCityClick}
                />

              ))}

            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default TheaterHero;