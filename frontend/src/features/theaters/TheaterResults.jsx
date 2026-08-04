import TheaterCard from "./TheaterCard";

const TheaterResults = ({ theaters }) => {
  return (
    <section className="theater-results">

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