import { useEffect, useState } from 'react';
import useBodyScrollLock from '../../../hooks/useBodyScrollLock';

export default function OfferModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <div className="offer-modal" role="dialog" aria-modal="true" aria-label="Limited time offer">
      <div className="offer-backdrop" onClick={() => setOpen(false)}></div>
      <div className="offer-card">
        <button className="offer-close" aria-label="Close offer" onClick={() => setOpen(false)}>
          &#10005;
        </button>
        <span className="offer-kicker">Limited Time</span>
        <h3>Book Your Beautiful Transformation</h3>
        <p>Reserve your bridal, party makeup, skin care, or hairstyling slot in Pondicherry or Karaikal.</p>
        <div className="offer-actions">
          <a href="#contact" className="offer-primary" onClick={() => setOpen(false)}>
            Book Now
          </a>
          <button className="offer-secondary" onClick={() => setOpen(false)}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}


