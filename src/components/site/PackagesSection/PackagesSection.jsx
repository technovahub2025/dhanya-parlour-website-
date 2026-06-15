import { Crown, Gem, MessageCircle, Sparkles, Star } from 'lucide-react';
import { QUOTATION_GROUPS } from '../../QuotationMaker/quotationData';
import { WHATSAPP_URL } from '../../../data/contactData';

const BRIDAL_PACKAGE_GROUP = QUOTATION_GROUPS.find((group) => group.id === 'bridal-packages');
const PACKAGE_ICONS = {
  'pro-hd-makeup-package': Crown,
  'luxury-airbrush-bridal-package': Sparkles,
  'silver-package-hd-makeup': Gem,
  'gold-package-premium-choice': Star,
};

export default function PackagesSection() {
  return (
    <section id="modes" className="modes-section">
      <div className="modes-inner">
        <div className="modes-heading">
          <div>
            <span className="section-label">Bridal Packages</span>
            <h2>Choose the finish made for your celebration.</h2>
          </div>
          <p>Four thoughtfully designed bridal experiences, from essential HD elegance to complete luxury styling.</p>
        </div>
        <div className="modes-grid">
          <span className="modes-grid-line modes-grid-line--left" aria-hidden="true" />
          <span className="modes-grid-line modes-grid-line--right" aria-hidden="true" />
          {BRIDAL_PACKAGE_GROUP.items.map((mode, index) => {
            const PackageIcon = PACKAGE_ICONS[mode.id] || Sparkles;
            const isLeft = index % 2 === 0;
            const bookingMessage = encodeURIComponent(
              `Hi Dhanya Makeup Studio, I would like to book the ${mode.name}. Please share availability and booking details.`
            );

            return (
              <article
                key={mode.id}
                className={`mode-card ${isLeft ? 'mode-card--left' : 'mode-card--right'}`}
              >
                {isLeft ? (
                  <>
                    <span className="mode-timeline-node" aria-hidden="true">
                      <span className="mode-timeline-dot" />
                    </span>
                    <div className="mode-card-surface">
                      <div className="mode-card-top">
                        <span className="mode-offer-badge">
                          <PackageIcon size={15} aria-hidden="true" />
                          {mode.badgeLabel}
                        </span>
                        <span className="mode-index">0{index + 1}</span>
                      </div>

                      <h3>{mode.name}</h3>
                      <p className="mode-subtitle">{mode.tagline}</p>

                      <div className="mode-price-row">
                        <div>
                          <span>Package Price</span>
                          {mode.priceContext && <small>{mode.priceContext}</small>}
                        </div>
                        <strong>{mode.priceLabel}</strong>
                      </div>

                      <p className="mode-description">{mode.description}</p>

                      <ul className="mode-highlights">
                        {mode.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>

                      <div className="mode-benefits" aria-label="Package benefits">
                        {mode.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}
                      </div>

                      <div className="mode-offer-copy">
                        <Sparkles size={15} aria-hidden="true" />
                        <span>{mode.offerLabel || mode.footerLabel}</span>
                      </div>

                      <a
                        href={`${WHATSAPP_URL}?text=${bookingMessage}`}
                        className="mode-cta"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        Book Package
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mode-card-surface">
                      <div className="mode-card-top">
                        <span className="mode-offer-badge">
                          <PackageIcon size={15} aria-hidden="true" />
                          {mode.badgeLabel}
                        </span>
                        <span className="mode-index">0{index + 1}</span>
                      </div>

                      <h3>{mode.name}</h3>
                      <p className="mode-subtitle">{mode.tagline}</p>

                      <div className="mode-price-row">
                        <div>
                          <span>Package Price</span>
                          {mode.priceContext && <small>{mode.priceContext}</small>}
                        </div>
                        <strong>{mode.priceLabel}</strong>
                      </div>

                      <p className="mode-description">{mode.description}</p>

                      <ul className="mode-highlights">
                        {mode.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>

                      <div className="mode-benefits" aria-label="Package benefits">
                        {mode.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}
                      </div>

                      <div className="mode-offer-copy">
                        <Sparkles size={15} aria-hidden="true" />
                        <span>{mode.offerLabel || mode.footerLabel}</span>
                      </div>

                      <a
                        href={`${WHATSAPP_URL}?text=${bookingMessage}`}
                        className="mode-cta"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        Book Package
                      </a>
                    </div>
                    <span className="mode-timeline-node" aria-hidden="true">
                      <span className="mode-timeline-dot" />
                    </span>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


