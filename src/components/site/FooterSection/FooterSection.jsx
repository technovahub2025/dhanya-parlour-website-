import { EMAIL_URL, INSTAGRAM_LABEL, INSTAGRAM_URL } from '../../../data/contactData';

export default function FooterSection() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="Dhanya Makeup Studio Karaikal" />
          </div>
        </div>
        <div className="footer-col">
          <h4>Studio</h4>
          <p>Pondicherry & Karaikal<br />Bridal and beauty services</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <a href="#contact-us">Contact Us</a>
          <a href="#contact">Book Now</a>
        </div>
        <div className="footer-col social-col">
          <h4>Connect</h4>
          <a href={EMAIL_URL} target="_blank" rel="noreferrer">Email</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label={INSTAGRAM_LABEL}>
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bar">
        <p>&copy; 2026 Dhanya Makeup Studio.</p>
      </div>
    </footer>
  );
}

