import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>🎬 Movira</h2>

          <p>
            Discover movies with smart recommendations,
            AI assistance, trailers and community reviews.
          </p>
        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <a href="/">Home</a>

          <a href="/search-results">Movies</a>

          <a href="#">AI Assistant</a>

          <a href="#">Nearby Theaters</a>

        </div>

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>📧 contact@movira.com</p>

          <p>📍 India</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Movira. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;