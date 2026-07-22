import TheaterCard from "./TheaterCard";

const TheaterResults = ({ theaters }) => {
  return (
    <section className="theater-results">
      <h1>Nearby Theaters</h1>

      {theaters.map((theater) => (
        <TheaterCard
          key={theater.id}
          theater={theater}
        />
      ))}
    </section>
  );
};

export default TheaterResults;