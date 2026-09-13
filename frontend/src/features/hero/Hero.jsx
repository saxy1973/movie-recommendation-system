import { useEffect } from "react";
import "./hero.css";
import HeroContent from "./HeroContent";
import HeroBanner from "./HeroBanner";

const Hero = () => {

  useEffect(() => {
    document.body.classList.add("hero-page");

    return () => {
      document.body.classList.remove("hero-page");
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <HeroContent />
        <HeroBanner />
      </div>
    </section>
  );
};

export default Hero;