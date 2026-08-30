import "./details.css";

const Trailer = ({ trailer }) => {

  const openTrailer = () => {

    if (!trailer) return;

    window.open(
      `https://www.youtube.com/watch?v=${trailer.key}`,
      "_blank"
    );

  };


  return (

    <section className="trailer-section">

      <h2>🎥 Official Trailer</h2>


      {trailer ? (

        <div
          className="trailer-card"
          onClick={openTrailer}
        >

          <div className="play-button">
            ▶
          </div>

          
            <h3>Official Trailer</h3>
          

          <p>
            Click to watch on YouTube
          </p>

        </div>

      ) : (

        <div className="trailer-card">

          <div className="play-button">
            ▶
          </div>

          <h3>
            Trailer Not Available
          </h3>

          <p>
            No official trailer found for this movie.
          </p>

        </div>

      )}

    </section>

  );

};

export default Trailer;