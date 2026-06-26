import "./details.css";

const CastCard = ({ actor }) => {
  return (
    <div className="cast-card">
      <div className="cast-avatar">
        👤
      </div>

      <h4>{actor}</h4>

      <p>Actor</p>
    </div>
  );
};

export default CastCard;