import TheaterCard from "./TheaterCard";

const TheaterResults = ({ theaters }) => {
  return (
    <section className="theater-results">
      <h1>Nearby Theaters</h1>

     <div className="theater-grid">
  {theaters.map((theater, index) => (
    <TheaterCard
        key={theater.id}
        theater={theater}
        index={index}
    />
))}
</div>
    </section>
  );
};

export default TheaterResults;