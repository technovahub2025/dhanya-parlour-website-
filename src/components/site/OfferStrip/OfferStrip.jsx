import { PRIMARY_PHONE, SECONDARY_PHONE } from '../../../data/contactData';
import MagneticCta from '../../common/MagneticCta/MagneticCta';

export default function OfferStrip() {
  return (
    <section id="offers" className="offer-strip">
      <div className="offer-strip-inner">
        <div className="offer-strip-badge">50% Offer</div>
        <div className="offer-strip-copy">
          Book Your Beautiful Transformation Today! Call {PRIMARY_PHONE} / {SECONDARY_PHONE}.
        </div>
        <MagneticCta href="#contact" className="offer-strip-cta" shineVariant="solid">
          Book Your Slot Now
        </MagneticCta>
      </div>
    </section>
  );
}


