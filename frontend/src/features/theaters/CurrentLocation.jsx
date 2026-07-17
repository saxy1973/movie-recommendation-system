import { MapPin } from "lucide-react";

const CurrentLocation = () => {
  return (
    <button className="location-btn">
      <MapPin size={22} />
      <span>Turn On Current Location</span>
    </button>
  );
};

export default CurrentLocation;