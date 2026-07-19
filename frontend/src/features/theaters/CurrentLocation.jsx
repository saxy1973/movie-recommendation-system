import { MapPin } from "lucide-react";
import { getNearbyTheaters } from "../../services/theaterService";

const CurrentLocation = ({
  setTheaters,
  setLoading,
  setError,
}) => {

const handleCurrentLocation = () => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported.");
    return;
  }

  setLoading(true);
  setError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const data = await getNearbyTheaters(latitude, longitude);

        setTheaters(data);
      } catch (err) {
        setError("Failed to fetch nearby theaters.");
      } finally {
        setLoading(false);
      }
    },
    () => {
      setLoading(false);
      setError("Location permission denied.");
    }
  );
};

  return (
    <button
  className="location-btn"
  onClick={handleCurrentLocation}
>
      <MapPin size={22} />
      <span>Find Nearby Theaters</span>
    </button>
  );
};

export default CurrentLocation;