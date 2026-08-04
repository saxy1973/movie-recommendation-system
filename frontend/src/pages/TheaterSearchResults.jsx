import { useLocation, useNavigate } from "react-router-dom";

import SearchBar from "../features/theaters/SearchBar";
import CurrentLocation from "../features/theaters/CurrentLocation";
import TheaterResults from "../features/theaters/TheaterResults";

import "../features/theaters/theater.css";

const TheaterSearchResults = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const theaters = state?.theaters || [];
  const city = state?.city || "";

  return (

    <main className="theaters-page">

      <div className="theaters-container">

       

        <h2 className="results-title">
          {city ? `Theaters in ${city}` : "Nearby Theaters"}
        </h2>

        <TheaterResults theaters={theaters} />

      </div>

    </main>

  );

};

export default TheaterSearchResults;