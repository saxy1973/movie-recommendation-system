const TheaterCard = ({ theater }) => {
  return (
    <div className="theater-card">
      <h3>{theater.name}</h3>
      <p>{theater.address}</p>
    </div>
  );
};

export default TheaterCard;