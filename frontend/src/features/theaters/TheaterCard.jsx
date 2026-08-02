import { MapPin, Navigation } from "lucide-react";
import image3 from "../../assets/images/theater/image_3.png";

const TheaterCard = ({ theater }) => {
const openMap = () => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${theater.latitude},${theater.longitude}`,
    "_blank"
  );
};
  return (
    <div className="theater-card">

      <div
        className="theater-banner"
        style={{
          backgroundImage: `linear-gradient(
    rgba(0,0,0,.15),
    rgba(0,0,0,.72)
),
url(${image3})`,
        }}
      />

      <div className="theater-content">

        <h3>{theater.name}</h3>

      <p
  className="theater-address"
  title={theater.address}
>
  <MapPin size={14}/>
  <span>{theater.address}</span>
</p>

        <p className="theater-distance">
          {theater.distance} km away
        </p>

        <button
          className="direction-btn"
          onClick={openMap}
        >
          <Navigation size={17}/>
          Get Directions
        </button>

      </div>

    </div>
  );
};

export default TheaterCard;