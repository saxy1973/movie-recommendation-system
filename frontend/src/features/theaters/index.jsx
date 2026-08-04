import "./theater.css";
import { useState } from "react";

import TheaterHero from "./TheaterHero";

const Theaters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="theaters-page">

      <TheaterHero
        setLoading={setLoading}
        setError={setError}
      />

      {loading && (
        <p>Loading...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

    </main>
  );
};

export default Theaters;