import MagneticCta from '../../common/MagneticCta/MagneticCta';

export default function HeroSection() {
  return (
    <header id="home" className="hero">
      <div className="hero-bg">
        <img src="/images/hero.png" alt="Bridal makeup by Dhanya Makeup Studio Karaikal" />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="offer-ribbon">
          <span className="offer-pill">Pondicherry & Karaikal</span>
          <span className="offer-text">Bridal, HD, Airbrush & Glass Glow Makeup</span>
        </div>
        <span className="subtitle">Enhancing Beauty, Creating Confidence</span>
        <h1>Your Dream Look, <br /> <em>Our Passion!</em></h1>
        <p>Bridal Makeup, HD Makeup, Airbrush Makeup & Glass Glow Makeup in Pondicherry and Karaikal.</p>
        <div className="cta-wrapper">
          <MagneticCta href="#contact" className="magnetic-btn" shineVariant="gold">
            <span className="btn-text">Book Your Slot Now</span>
          </MagneticCta>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="line"></div>
      </div>
    </header>
  );
}


