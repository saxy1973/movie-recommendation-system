import "./theater.css";

const RegionCard = ({ city, image, onClick }) => {
  return (
    <div
      className="region-card"
      onClick={() => onClick(city)}
    >
      <img
        src={image}
        alt={city}
        className={`region-image ${city.toLowerCase()}`}
      />

      <div className="region-overlay"></div>

      <div className="region-content">
        <h4>{city}</h4>
      </div>
    </div>
  );
};

export default RegionCard;