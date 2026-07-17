import "./theater.css";
import CurrentLocation from "./CurrentLocation";
import SearchBar from "./SearchBar";

const Theaters = () => {
  return (
    <main className="theaters-page">
      <div className="theaters-container">

        <CurrentLocation />

        <div className="divider">
          <span>OR</span>
        </div>

        <SearchBar />

        <h2 className="location-heading">
          Browse by Location
        </h2>

      </div>
    </main>
  );
};

export default Theaters; 