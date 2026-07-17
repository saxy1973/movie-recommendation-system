import { useEffect, useState } from "react";

const Theaters = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError("Location permission denied.");
      }
    );
  }, []);

  return (
    <div className="theaters-page">
      <h1>Nearby Theaters</h1>

      {error && <p>{error}</p>}

      {location ? (
        <>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </>
      ) : (
        !error && <p>Getting your location...</p>
      )}
    </div>
  );
};

export default Theaters;