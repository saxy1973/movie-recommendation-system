import "./hero.css";
import HeroContent from "./HeroContent";
import HeroBanner from "./HeroBanner";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">

        <HeroContent />

        <HeroBanner />

      </div>
    </section>
  );
};

export default Hero;