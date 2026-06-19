import { PRIMARY_PHONE } from '../../../data/contactData';
import MagneticCta from '../../common/MagneticCta/MagneticCta';

export default function OfferDetailsSection() {
  return (
    <section className="offer-details">
      <div className="offer-details-inner">
        <div className="offer-details-top">
          <div className="offer-details-intro">
            <span className="offer-title-kicker">Dhanya Makeup Studio</span>
            <h2>Bridal-ready beauty care in Pondicherry and Karaikal.</h2>
            <p>
              Choose from Silver, Gold, Pro HD, and Luxury Airbrush bridal looks designed for a flawless,
              elegant, and camera-ready finish.
            </p>
          </div>
          <aside className="offer-spotlight">
            <span className="spotlight-kicker">Call To Book</span>
            <h3>{PRIMARY_PHONE}</h3>
            <p>Ask about bridal packages, pre-bridal care, party makeup, and hairstyling slots.</p>
            <MagneticCta href="#contact" className="offer-primary" shineVariant="solid">Book Now</MagneticCta>
          </aside>
        </div>
        <div className="offer-fast-facts">
          <div className="fact-pill">
            <strong>HD</strong>
            <span>Camera-ready makeup for events</span>
          </div>
          <div className="fact-pill">
            <strong>Airbrush</strong>
            <span>Long-lasting luxury finish</span>
          </div>
          <div className="fact-pill">
            <strong>Glass Glow</strong>
            <span>Radiant skin-focused looks</span>
          </div>
          <div className="fact-pill">
            <strong>2 Studios</strong>
            <span>Pondicherry and Karaikal support</span>
          </div>
        </div>
        <div className="offer-details-grid">
          <article className="offer-detail-card">
            <h4>Makeup</h4>
            <ul className="offer-list">
              <li>Bridal Makeup</li>
              <li>Party Makeup</li>
              <li>Engagement Makeup</li>
              <li>HD, Airbrush & Glass Glow Makeup</li>
            </ul>
          </article>
          <article className="offer-detail-card">
            <h4>Care Services</h4>
            <ul className="offer-list">
              <li>Facials, clean-up & skin polishing</li>
              <li>De-tan, bleach & threading</li>
              <li>Hair spa, coloring, straightening & keratin</li>
              <li>Manicure, pedicure, waxing & nail care</li>
            </ul>
          </article>
          <article className="offer-detail-card offer-proof">
            <h4>Bridal Support</h4>
            <div className="proof-stats">
              <div>
                <strong>Silver</strong>
                <span>HD bridal makeup package</span>
              </div>
              <div>
                <strong>Gold</strong>
                <span>Premium bridal choice</span>
              </div>
              <div>
                <strong>Pro HD</strong>
                <span>Enhanced bridal finish</span>
              </div>
            </div>
            <MagneticCta href="#contact" className="offer-primary proof-cta" shineVariant="solid">Book Bridal Care</MagneticCta>
          </article>
        </div>
      </div>
    </section>
  );
}


