import { OFFER_CARDS } from '../../data/offerHighlights';

function OfferCard({ card }) {
  switch (card.type) {
    case 'combo':
      return (
        <div className="offer-card-mini offer-card-mini--combo">
          <div className="offer-card-head">
            <h4>{card.title}</h4>
            <span className="offer-tag">{card.tag}</span>
          </div>
          <div className="offer-price">
            <span className="price-old">{card.priceOld}</span>
            <span className="price-new">{card.priceNew}</span>
          </div>
          <p className="offer-card-subtitle">{card.subtitle}</p>
          <div className="offer-card-copy">
            <span className="offer-card-copy-label">{card.label}</span>
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="offer-card-note">{card.note}</p>
          <a className="offer-card-cta" href="#contact">{card.cta}</a>
        </div>
      );
    case 'hair':
      return (
        <div className="offer-card-mini offer-card-mini--hair">
          <div className="offer-card-head">
            <h4>{card.title}</h4>
            <span className="offer-tag">{card.tag}</span>
          </div>
          <div className="offer-price">
            <span className="price-old">{card.priceOld}</span>
          </div>
          <p className="offer-card-subtitle">{card.subtitle}</p>
          <p className="offer-card-starting">
            {card.startingLabel} <span className="offer-card-starting-price">{card.startingPrice}</span>
          </p>
          <div className="offer-card-copy">
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="offer-card-note">{card.note}</p>
          <a className="offer-card-cta" href="#contact">{card.cta}</a>
        </div>
      );
    case 'extensions':
      return (
        <div className="offer-card-mini offer-card-mini--extensions">
          <div className="offer-card-head">
            <h4>{card.title}</h4>
            <span className="offer-tag">{card.tag}</span>
          </div>
          <div className="offer-price">
            <span className="price-old">{card.priceOld}</span>
            <span className="price-new">{card.priceNew}</span>
          </div>
          <p className="offer-card-subtitle">{card.subtitle}</p>
          <div className="offer-card-copy">
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <a className="offer-card-cta" href="#contact">{card.cta}</a>
        </div>
      );
    case 'party':
      return (
        <div className="offer-card-mini offer-card-mini--party">
          <div className="offer-card-head">
            <h4>{card.title}</h4>
          </div>
          <p className="offer-card-subtitle">{card.subtitle}</p>
          <p className="offer-card-starting">
            {card.startingLabel} <span className="offer-card-starting-price">{card.startingPrice}</span>
          </p>
          <div className="offer-card-copy">
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="offer-card-note">{card.note}</p>
          <a className="offer-card-cta" href="#contact">{card.cta}</a>
        </div>
      );
    case 'bridal':
    default:
      return (
        <div className="offer-card-mini offer-card-mini--bridal">
          <div className="offer-card-head">
            <h4>{card.title}</h4>
            <span className="offer-tag">{card.tag}</span>
          </div>
          <p className="offer-card-starting">
            {card.startingLabel} <span className="offer-card-starting-price">{card.startingPrice}</span>
          </p>
          <div className="offer-card-copy">
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="offer-card-note">{card.note}</p>
          <a className="offer-card-cta" href="#contact">{card.cta}</a>
        </div>
      );
  }
}

export default function OfferHighlights() {
  return (
    <section className="offer-highlights">
      <div className="offer-highlights-inner">
        <div className="offer-title">
          <span className="offer-title-kicker">Offer Highlights</span>
          <h2>Luxury, elevated. Prices, halved.</h2>
          <p>Choose a signature treatment and enjoy our limited 50% celebration offer.</p>
        </div>
        <div className="offer-cards-shell">
          <div className="offer-cards">
            {OFFER_CARDS.map((card) => (
              <OfferCard key={card.id} card={card} />
            ))}
          </div>
        </div>
        <div className="offer-note">
          Limited slots available this week. Book now to secure your preferred time.
        </div>
      </div>
    </section>
  );
}
