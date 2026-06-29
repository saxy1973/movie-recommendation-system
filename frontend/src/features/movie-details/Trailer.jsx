import "./details.css";

const Trailer = () => {
  return (
    <section className="trailer-section">

      <h2>🎥 Official Trailer</h2>

      <div
        className="trailer-card"
        onClick={() =>
          window.open(
            "https://www.youtube.com/results?search_query=Batman+Begins+Official+Trailer",
            "_blank"
          )
        }
      >
        <div className="play-button">
          ▶
        </div>

        <h3>Watch Official Trailer</h3>

        <p>Click to watch on YouTube</p>

      </div>

    </section>
  );
};

export default Trailer;