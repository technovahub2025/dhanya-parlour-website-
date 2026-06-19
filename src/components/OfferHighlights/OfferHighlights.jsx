import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFER_CARDS } from '../../data/offerHighlights';
import MagneticCta from '../common/MagneticCta/MagneticCta';

const AUTOPLAY_DELAY = 4000;

function OfferCardCta({ card, isActive }) {
  return (
    <MagneticCta href="#contact" className="offer-card-cta" tabIndex={isActive ? 0 : -1} shineVariant="gold">
      {card.cta}
    </MagneticCta>
  );
}

function OfferCard({ card, isActive }) {
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
          <OfferCardCta card={card} isActive={isActive} />
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
          <OfferCardCta card={card} isActive={isActive} />
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
          <OfferCardCta card={card} isActive={isActive} />
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
          <OfferCardCta card={card} isActive={isActive} />
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
          <OfferCardCta card={card} isActive={isActive} />
        </div>
      );
  }
}

export default function OfferHighlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(document.hidden);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const shellRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const previousPositionsRef = useRef([]);
  const pointerStartRef = useRef(null);
  const didSwipeRef = useRef(false);
  const cardCount = OFFER_CARDS.length;
  const isPaused = isHovered || isFocusWithin || isDragging || isPageHidden;

  const getRelativePosition = useCallback((index) => {
    let position = (index - activeIndex + cardCount) % cardCount;
    if (position > Math.floor(cardCount / 2)) {
      position -= cardCount;
    }
    return position;
  }, [activeIndex, cardCount]);

  const selectCard = useCallback((index) => {
    setActiveIndex((index + cardCount) % cardCount);
  }, [cardCount]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + cardCount) % cardCount);
  }, [cardCount]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % cardCount);
  }, [cardCount]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (event) => setPrefersReducedMotion(event.matches);
    const handleVisibilityChange = () => setIsPageHidden(document.hidden);

    motionQuery.addEventListener('change', handleMotionChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      return undefined;
    }

    const timer = window.setInterval(showNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, showNext]);

  useLayoutEffect(() => {
    const positions = OFFER_CARDS.map((_, index) => getRelativePosition(index));
    const presets = {
      '-2': { xPercent: -126, y: 25, scale: 0.76, opacity: 0.3, rotationY: 7, zIndex: 1 },
      '-1': { xPercent: -72, y: 13, scale: 0.88, opacity: 0.68, rotationY: 4, zIndex: 3 },
      0: { xPercent: 0, y: 0, scale: 1, opacity: 1, rotationY: 0, zIndex: 5 },
      1: { xPercent: 72, y: 13, scale: 0.88, opacity: 0.68, rotationY: -4, zIndex: 3 },
      2: { xPercent: 126, y: 25, scale: 0.76, opacity: 0.3, rotationY: -7, zIndex: 1 },
    };

    cardRefs.current.forEach((element, index) => {
      if (!element) {
        return;
      }

      const position = positions[index];
      const previousPosition = previousPositionsRef.current[index];
      const preset = presets[position];
      const wrapped = previousPosition !== undefined && Math.abs(position - previousPosition) > 2;

      element.dataset.position = String(position);

      if (prefersReducedMotion) {
        gsap.set(element, preset);
        if (position === 0) {
          gsap.set(element, { clearProps: 'transform' });
        }
        return;
      }

      if (wrapped) {
        gsap.set(element, { ...preset, opacity: 0 });
        gsap.to(element, {
          opacity: preset.opacity,
          duration: 0.38,
          delay: 0.12,
          ease: 'power2.out',
          overwrite: true,
        });
        return;
      }

      const animation = {
        ...preset,
        duration: 0.62,
        ease: 'power3.inOut',
        overwrite: true,
      };

      if (position === 0) {
        animation.onComplete = () => gsap.set(element, { clearProps: 'transform' });
      }

      gsap.to(element, animation);
    });

    previousPositionsRef.current = positions;
  }, [activeIndex, getRelativePosition, prefersReducedMotion]);

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    pointerStartRef.current = { x: event.clientX, pointerId: event.pointerId };
    didSwipeRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!start) {
      return;
    }

    const distance = event.clientX - start.x;
    if (Math.abs(distance) >= 45) {
      didSwipeRef.current = true;
      if (distance < 0) {
        showNext();
      } else {
        showPrevious();
      }
    }
  };

  const handlePointerCancel = (event) => {
    if (event?.currentTarget?.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerStartRef.current = null;
    didSwipeRef.current = false;
    setIsDragging(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <section className="offer-highlights">
      <div className="offer-highlights-inner">
        <div className="offer-title">
          <span className="offer-title-kicker">Offer Highlights</span>
          <h2>Bridal glow, party glam, and beauty care.</h2>
          <p>Choose makeup, skin care, hair care, or bridal services from Dhanya Makeup Studio Pondicherry and Karaikal.</p>
        </div>
        <div
          className={`offer-cards-shell ${isDragging ? 'is-dragging' : ''}`}
          ref={shellRef}
          tabIndex="0"
          aria-roledescription="carousel"
          aria-label="Offer highlights"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsFocusWithin(false);
            }
          }}
          onKeyDown={handleKeyDown}
        >
          <div
            className="offer-cards"
            ref={trackRef}
            onPointerDown={(event) => {
              const target = event.target instanceof Element ? event.target : null;
              if (target?.closest('.offer-carousel-controls')) {
                return;
              }

              handlePointerDown(event);
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={(event) => {
              if (isDragging && event.buttons === 0) {
                handlePointerCancel();
              }
            }}
          >
            {OFFER_CARDS.map((card, index) => {
              const position = getRelativePosition(index);
              const isActive = position === 0;

              return (
                <div
                  key={card.id}
                  className={`offer-card-position ${isActive ? 'is-active' : 'is-side'}`}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  role={isActive ? 'group' : 'button'}
                  tabIndex={isActive ? -1 : 0}
                  aria-label={isActive ? `${card.title}, current offer` : `Show ${card.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(event) => {
                    if (didSwipeRef.current) {
                      event.preventDefault();
                      didSwipeRef.current = false;
                      return;
                    }

                    if (!isActive) {
                      event.preventDefault();
                      selectCard(index);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!isActive && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      selectCard(index);
                    }
                  }}
                >
                  <OfferCard card={card} isActive={isActive} />
                </div>
              );
            })}
          </div>

          <div className="offer-carousel-controls">
            <button type="button" className="offer-carousel-arrow" onClick={showPrevious} aria-label="Previous offer">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className="offer-carousel-dots" aria-label="Choose offer">
              {OFFER_CARDS.map((card, index) => (
                <button
                  type="button"
                  key={card.id}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => selectCard(index)}
                  aria-label={`Show ${card.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
            <button type="button" className="offer-carousel-arrow" onClick={showNext} aria-label="Next offer">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="offer-note">
          Limited slots available this week. Call 8072966960 or 8148966960 to secure your preferred time.
        </div>
      </div>
    </section>
  );
}
