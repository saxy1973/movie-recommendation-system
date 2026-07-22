import "./theater.css";
import { useState } from "react";

import TheaterHero from "./TheaterHero";
import TheaterResults from "./TheaterResults";

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);

  return (
    <main className="theaters-page">
      {!showResults ? (
        <TheaterHero
          setTheaters={setTheaters}
          setLoading={setLoading}
          setError={setError}
          setShowResults={setShowResults}
        />
      ) : (
        <TheaterResults
          theaters={theaters}
          loading={loading}
          error={error}
          setShowResults={setShowResults}
        />
      )}
    </main>
  );
};

export default Theaters;