import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import OfferHighlights from '../OfferHighlights/OfferHighlights';

const SERVICE_GROUPS = [
  {
    id: 'hair-services',
    label: 'Hair Services',
    options: [
      { value: 'hair-styling', label: 'Hair Styling' },
      { value: 'hair-straightening', label: 'Hair Straightening' },
      { value: 'permanent-hair-treatment', label: 'Permanent Hair Treatment' },
      { value: 'hair-care-treatment', label: 'Hair Care Treatment' },
    ],
  },
  {
    id: 'skin-facial-services',
    label: 'Skin & Facial Services',
    options: [
      { value: 'facial-treatment', label: 'Facial Treatment' },
      { value: 'hydra-facial', label: 'Hydra Facial' },
      { value: 'skin-care-treatment', label: 'Skin Care Treatment' },
    ],
  },
  {
    id: 'bridal-services',
    label: 'Bridal Services',
    options: [
      { value: 'bridal-artistry', label: 'Bridal Artistry' },
      { value: 'bridal-makeup', label: 'Bridal Makeup' },
      { value: 'saree-draping-pre-pleating', label: 'Saree Draping & Pre-Pleating' },
    ],
  },
  {
    id: 'spa-wellness',
    label: 'Spa & Wellness',
    options: [
      { value: 'foot-care', label: 'Foot Care' },
      { value: 'foot-relaxation-therapy', label: 'Foot Relaxation Therapy' },
      { value: 'basic-pedicure', label: 'Basic Pedicure' },
      { value: 'spa-pedicure', label: 'Spa Pedicure' },
    ],
  },
  {
    id: 'specialized-treatments',
    label: 'Specialized Treatments',
    options: [{ value: 'invisive-pill-treatment', label: 'Invisive Pill Treatment' }],
  },
];

const SERVICE_OPTIONS = SERVICE_GROUPS.flatMap((group) => group.options);
const MIN_BOOKING_DATE = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  .toISOString()
  .split('T')[0];
let bodyScrollLockCount = 0;

function useBodyScrollLock(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    bodyScrollLockCount += 1;
    document.body.classList.add('no-scroll');

    return () => {
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
      if (bodyScrollLockCount === 0) {
        document.body.classList.remove('no-scroll');
      }
    };
  }, [enabled]);
}

export function OfferModal() {
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
        <h3>Exclusive 50% Offer</h3>
        <p>Reserve a premium session this week and enjoy half off our signature treatments.</p>
        <div className="offer-actions">
          <a href="#contact" className="offer-primary" onClick={() => setOpen(false)}>
            Claim Offer
          </a>
          <button className="offer-secondary" onClick={() => setOpen(false)}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useBodyScrollLock(mobileMenuOpen);

  return (
    <>
      <nav className="navbar">
        <div className="logo">DHANYA'S MAKEOVER</div>
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#offers" onClick={() => setMobileMenuOpen(false)}>Offers</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#modes" onClick={() => setMobileMenuOpen(false)}>Modes</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>The Experience</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Book Now</a>
        </div>
        <button
          className="menu-btn"
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
      </nav>
      {mobileMenuOpen && <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />}
    </>
  );
}

function useMagnetHandlers() {
  const handleMove = (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  };

  const handleLeave = (event) => {
    event.currentTarget.style.transform = 'translate(0, 0)';
  };

  return { handleMove, handleLeave };
}

export function HeroSection() {
  const { handleMove, handleLeave } = useMagnetHandlers();

  return (
    <header id="home" className="hero">
      <div className="hero-bg">
        <img src="/images/hero.png" alt="Luxury Salon Interior" />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="offer-ribbon">
          <span className="offer-pill">50% Off</span>
          <span className="offer-text">Signature treatments this week only</span>
        </div>
        <span className="subtitle">A Unique Experience</span>
        <h1>The Art of <br /> <em>Timeless Beauty</em></h1>
        <p>A sanctuary where precision meets luxury. Elevating your essence.</p>
        <div className="cta-wrapper">
          <a href="#booking" className="magnetic-btn" onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <span className="btn-text">Reserve Your Spot</span>
          </a>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="line"></div>
      </div>
    </header>
  );
}

export function OfferStrip() {
  return (
    <section id="offers" className="offer-strip">
      <div className="offer-strip-inner">
        <div className="offer-strip-badge">50% Offer</div>
        <div className="offer-strip-copy">
          Indulge in couture styling, radiance facials, and our holistic spa at half the price.
        </div>
        <a href="#contact" className="offer-strip-cta">Book With 50% Off</a>
      </div>
    </section>
  );
}

export function OfferDetailsSection() {
  return (
    <section className="offer-details">
      <div className="offer-details-inner">
        <div className="offer-details-top">
          <div className="offer-details-intro">
            <span className="offer-title-kicker">Why This Offer Works</span>
            <h2>Everything a new guest needs to say yes.</h2>
            <p>
              We made this offer transparent and easy to claim so customers can decide quickly with confidence.
            </p>
          </div>
          <aside className="offer-spotlight">
            <span className="spotlight-kicker">Limited-Time Spotlight</span>
            <h3>Save up to Rs. 4,000 today</h3>
            <p>Book this week and lock premium pricing with priority time slots.</p>
            <a href="#contact" className="offer-primary">Book My Offer</a>
          </aside>
        </div>
        <div className="offer-fast-facts">
          <div className="fact-pill">
            <strong>50%</strong>
            <span>Instant savings on selected services</span>
          </div>
          <div className="fact-pill">
            <strong>7 Days</strong>
            <span>Offer valid this week only</span>
          </div>
          <div className="fact-pill">
            <strong>30 Min</strong>
            <span>Free consultation included</span>
          </div>
          <div className="fact-pill">
            <strong>Fast Booking</strong>
            <span>Get confirmation in one call</span>
          </div>
        </div>
        <div className="offer-details-grid">
          <article className="offer-detail-card">
            <h4>What You Get</h4>
            <ul className="offer-list">
              <li>50% off selected premium treatments</li>
              <li>Personalized consultation before service</li>
              <li>Priority weekday booking slots</li>
              <li>Complimentary after-care recommendations</li>
            </ul>
          </article>
          <article className="offer-detail-card">
            <h4>Why Customers Book Fast</h4>
            <ul className="offer-list">
              <li>Limited weekly appointments for offer pricing</li>
              <li>Visible savings before checkout</li>
              <li>High-demand services included in the campaign</li>
              <li>Direct book-now CTA on every offer block</li>
            </ul>
          </article>
          <article className="offer-detail-card offer-proof">
            <h4>Customer Confidence</h4>
            <div className="proof-stats">
              <div>
                <strong>1,200+</strong>
                <span>Premium sessions delivered</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Average guest satisfaction</span>
              </div>
              <div>
                <strong>92%</strong>
                <span>Repeat booking intent</span>
              </div>
            </div>
            <a href="#contact" className="offer-primary proof-cta">Claim My Offer</a>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const [activeService, setActiveService] = useState('hero');

  const backgrounds = [
    { bg: 'hero', className: 'active-default', image: '/images/hero.png', active: activeService === 'hero' },
    { bg: 'hair', image: '/images/hair.png', active: activeService === 'hair' },
    { bg: 'facial', image: '/images/facial.png', active: activeService === 'facial' },
    { bg: 'spa', image: '/images/spa.png', active: activeService === 'spa' },
    { bg: 'makeup', image: '/images/makeup.png', active: activeService === 'makeup' },
  ];

  return (
    <section id="services" className="services-list-section">
      <div className="service-bg-container">
        {backgrounds.map((item) => (
          <div
            key={item.bg}
            className={`service-bg ${item.className || ''}`}
            data-bg={item.bg}
            style={{ backgroundImage: `url('${item.image}')`, opacity: item.active ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="services-content">
        <div className="section-label">Our Service Collection</div>
        <ul className="service-list" onMouseLeave={() => setActiveService('hero')}>
          {[
            { id: 'hair', num: '01', name: 'Couture Styling' },
            { id: 'facial', num: '02', name: 'Radiance Facials' },
            { id: 'spa', num: '03', name: 'Holistic Spa' },
            { id: 'makeup', num: '04', name: 'Bridal Artistry' },
          ].map((item) => (
            <li
              key={item.id}
              className="service-item"
              data-target={item.id}
              onMouseEnter={() => setActiveService(item.id)}
              onMouseLeave={() => setActiveService('hero')}
            >
              <span className="service-num">{item.num}</span>
              <a href="#" className="service-link">
                <span className="service-name">{item.name}</span>
                <span className="service-arrow"><ArrowRight /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ModesSection() {
  return (
    <section id="modes" className="modes-section">
      <div className="modes-inner">
        <div className="section-label">Choose Your Mode</div>
        <div className="modes-grid">
          {[
            {
              id: 'signature',
              title: 'Signature Glow',
              subtitle: 'For radiant days',
              desc: 'A polished styling and skin refresh designed for effortless confidence.',
            },
            {
              id: 'recovery',
              title: 'Recovery Ritual',
              subtitle: 'For deep reset',
              desc: 'Therapeutic care and calming touch to restore balance, body, and mind.',
            },
            {
              id: 'bridal',
              title: 'Bridal Couture',
              subtitle: 'For milestone moments',
              desc: 'Bespoke beauty architecture with premium finishing for your most important events.',
            },
          ].map((mode, index) => (
            <article key={mode.id} className="mode-card">
              <span className="mode-index">0{index + 1}</span>
              <h3>{mode.title}</h3>
              <p className="mode-subtitle">{mode.subtitle}</p>
              <p>{mode.desc}</p>
              <a href="#contact" className="mode-cta">Select Mode</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="experience-editorial">
      <div className="editorial-content">
        <span className="editorial-subtitle">The Philosophy</span>
        <h2>We believe beauty is an architectural feat.</h2>
        <p>
          Every cut, every contour, every treatment is designed with the precision of high art. Step into a space
          where time slows down, and the focus is entirely on your restoration.
        </p>
      </div>
      <div className="editorial-image">
        <img src="/images/hero.png" alt="Interior Detail" />
      </div>
    </section>
  );
}

export function MarqueeSection() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!marqueeRef.current) {
      return undefined;
    }

    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: 'linear',
    });

    tween.totalProgress(0.5);
    return () => tween.kill();
  }, []);

  return (
    <div className="marquee-container">
      <div className="marquee-content" ref={marqueeRef}>
        {[1, 2, 3, 4].map((i) => (
          <span key={i}>
            <span>Elegance</span> <span className="separator">âœ¦</span>
            <span>Sophistication</span> <span className="separator">âœ¦</span>
            <span>Radiance</span> <span className="separator">âœ¦</span>
            <span>Dhanya's Makeover</span> <span className="separator">âœ¦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BookingSection() {
  const [selectedService, setSelectedService] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [expandedServiceGroup, setExpandedServiceGroup] = useState('hair-services');
  const serviceSelectRef = useRef(null);
  const serviceMenuScrollRef = useRef(null);
  const serviceMenuContentRef = useRef(null);
  const serviceMenuLenisRef = useRef(null);
  const selectedServiceLabel = SERVICE_OPTIONS.find((option) => option.value === selectedService)?.label || 'Select Service';

  useEffect(() => {
    const onPointerDown = (event) => {
      if (serviceSelectRef.current && !serviceSelectRef.current.contains(event.target)) {
        setServiceMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setServiceMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!serviceMenuOpen || !serviceMenuScrollRef.current || !serviceMenuContentRef.current) {
      return undefined;
    }

    const lenis = new Lenis({
      wrapper: serviceMenuScrollRef.current,
      content: serviceMenuContentRef.current,
      eventsTarget: serviceMenuScrollRef.current,
      smoothWheel: true,
      duration: 1.1,
    });

    serviceMenuLenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
    };

    const rafId = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      serviceMenuLenisRef.current = null;
    };
  }, [serviceMenuOpen]);

  const handleBookingSubmit = (event) => {
    event.preventDefault();
    const serviceLabel = selectedServiceLabel === 'Select Service' ? 'Not selected' : selectedServiceLabel;
    const bookingMessage = encodeURIComponent(
      [
        "Hi Dhanya's Makeover, I would like to book an appointment.",
        `Name: ${bookingName || 'Not provided'}`,
        `Email: ${bookingEmail || 'Not provided'}`,
        `Service: ${serviceLabel}`,
        `Preferred Date: ${preferredDate || 'Not selected'}`,
      ].join('\n')
    );

    window.open(`https://wa.me/918072966960?text=${bookingMessage}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="booking-minimal">
      <div className="booking-wrapper">
        <h2>Begin Your <br /><em>Transformation</em></h2>
        <form className="booking-form-minimal" onSubmit={handleBookingSubmit}>
          <div className="form-row">
            <label className="booking-field">
              <span>Name</span>
              <input
                type="text"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                required
              />
            </label>
            <label className="booking-field">
              <span>Email</span>
              <input
                type="email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <div className="booking-field booking-select-field">
              <span>Select Service</span>
              <div className="custom-select-wrap" ref={serviceSelectRef}>
                <button
                  type="button"
                  className={`minimal-select custom-select-btn ${serviceMenuOpen ? 'open' : ''}`}
                  onClick={() => {
                    const nextOpen = !serviceMenuOpen;
                    if (nextOpen) {
                      const selectedGroup = SERVICE_GROUPS.find((group) =>
                        group.options.some((option) => option.value === selectedService)
                      );
                      setExpandedServiceGroup(selectedGroup?.id || 'hair-services');
                    }
                    setServiceMenuOpen(nextOpen);
                  }}
                  aria-expanded={serviceMenuOpen}
                  aria-haspopup="listbox"
                  aria-label="Select Service"
                >
                  <span>{selectedServiceLabel}</span>
                  <span className="custom-select-arrow" aria-hidden="true" />
                </button>
                {serviceMenuOpen && (
                  <div
                    className="custom-select-menu"
                    role="listbox"
                    aria-label="Service options"
                    ref={serviceMenuScrollRef}
                  >
                    <div className="custom-select-menu-content" ref={serviceMenuContentRef}>
                      {SERVICE_GROUPS.map((group) => {
                        const isOpen = expandedServiceGroup === group.id;

                        return (
                          <section key={group.id} className={`custom-select-group ${isOpen ? 'open' : ''}`}>
                            <button
                              type="button"
                              className="custom-select-group-header"
                              onClick={() =>
                                setExpandedServiceGroup((prev) => (prev === group.id ? '' : group.id))
                              }
                              aria-expanded={isOpen}
                              aria-controls={`${group.id}-options`}
                            >
                              <span>{group.label}</span>
                              <span className="custom-select-group-arrow" aria-hidden="true" />
                            </button>

                            {isOpen && (
                              <div id={`${group.id}-options`} className="custom-select-group-options">
                                {group.options.map((option) => {
                                  const isSelected = selectedService === option.value;

                                  return (
                                    <button
                                      key={option.value}
                                      type="button"
                                      className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                                      onClick={() => {
                                        setSelectedService(option.value);
                                        setServiceMenuOpen(false);
                                      }}
                                      data-service-option={option.value}
                                      aria-selected={isSelected}
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  </div>
                )}
                <input type="hidden" name="service" value={selectedService} />
              </div>
            </div>
            <label className="booking-field booking-date-field">
              <span>Preferred Date</span>
              <input
                type="date"
                min={MIN_BOOKING_DATE}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="magnetic-btn-submit">
            Book Now on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-col brand-col">
          <h3 className="footer-logo">DHANYA'S MAKEOVER</h3>
        </div>
        <div className="footer-col">
          <h4>Branches</h4>
          <p>Karaikal Branch<br />Pondicherry Branch</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>+91 8072 966 960<br />concierge@dhanyasmakeover.com</p>
        </div>
        <div className="footer-col social-col">
          <a href="https://www.instagram.com/dhanya_skin_hair__pondicherry?igsh=d2t1eWxoZzNqaDdm" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#">Facebook</a>
        </div>
      </div>
      <div className="footer-bar">
        <p>&copy; 2026 Dhanya's Makeover Parlour.</p>
      </div>
    </footer>
  );
}
