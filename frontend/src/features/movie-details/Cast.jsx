import CastCard from "./CastCard";
import "./details.css";

const Cast = ({ actors }) => {
  if (!actors) return null;

  const cast = actors.split(", ");

  return (
    <section className="cast-section">

      <h2>🎭 Top Cast</h2>

      <div className="cast-container">
        {cast.map((actor, index) => (
          <CastCard
            key={index}
            actor={actor}
          />
        ))}
      </div>

    </section>
  );
};

export default Cast;