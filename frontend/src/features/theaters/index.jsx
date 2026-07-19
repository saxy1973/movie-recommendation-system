import "./theater.css";
import CurrentLocation from "./CurrentLocation";
import SearchBar from "./SearchBar";
import RegionCard from "./RegionCard";
import regions from "./data";

import { useState } from "react";
import { getNearbyTheaters, getCityTheaters } from "../../services/theaterService";

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  return (
    <main className="theaters-page">

      <section className="theater-hero">

        <div className="hero-overlay">

          <div className="hero-left">

  <span className="hero-badge">
    🎬 FIND CINEMAS
  </span>

  <h1 className="hero-title"> The Best Screens

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
  setTheaters={setTheaters}
  setLoading={setLoading}
  setError={setError}
/>

    <div className="divider">
        <span>OR</span>
    </div>

    <SearchBar />

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
        />
      ))}

    </div>

  </div>

</div>

        </div>

      </section>

    </main>
  );
};


export default Theaters;