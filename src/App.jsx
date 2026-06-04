import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowRight } from 'lucide-react';
import PriceCalculator from './components/PriceCalculator';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [activeService, setActiveService] = useState('hero'); // Default bg
  const [showOffer, setShowOffer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [expandedServiceGroup, setExpandedServiceGroup] = useState('hair-services');
  const heroImgRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const marqueeRef = useRef(null);
  const serviceSelectRef = useRef(null);
  const serviceMenuScrollRef = useRef(null);
  const serviceMenuContentRef = useRef(null);
  const serviceMenuLenisRef = useRef(null);

  const serviceGroups = [
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
      options: [
        { value: 'invisive-pill-treatment', label: 'Invisive Pill Treatment' },
      ],
    },
  ];

  const serviceOptions = serviceGroups.flatMap((group) => group.options);
  const selectedServiceLabel = serviceOptions.find((option) => option.value === selectedService)?.label || 'Select Service';
  const todayDate = new Date();
  const minBookingDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
    .toISOString()
    .split('T')[0];

  // Initialize Lenis and Global Animations
  // Initialize Lenis and Global Animations
  useEffect(() => {
    // Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    // Sync with GSAP
    lenis.on('scroll', ScrollTrigger.update);

    const handleCalcModalState = (event) => {
      if (event?.detail?.open) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('calc-modal-state', handleCalcModalState);

    // GSAP Context
    const ctx = gsap.context(() => {
      // Preloader & Entrance
      const tl = gsap.timeline();
      tl.to('.loader-line', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
        .to('.loader-text', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.in', delay: 0.2 })
        .to('.preloader', { y: '-100%', duration: 1, ease: 'power4.inOut' }, "-=0.4")
        .to('body', { opacity: 1, duration: 0.5 }, "-=0.8")
        .from('.hero-bg img', {
          scale: 1.2,
          filter: 'blur(10px)',
          duration: 2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to('.hero-bg img', {
              scale: 1.1,
              duration: 20,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }
        }, "-=1")
        .from('.subtitle', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.5")
        .from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.3")
        .from('.hero p', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, "-=1.1")
        .from('.cta-wrapper', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.9");

      // Scroll Indicator
      gsap.to('.scroll-indicator .line', {
        height: '100%',
        y: '100%',
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut"
      });

      gsap.to('.scroll-indicator', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '100px top',
          scrub: true
        },
        opacity: 0
      });

      // Marquee Velocity
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: "linear"
        }).totalProgress(0.5);


      }

      // Editorial Parallax
      gsap.to('.editorial-image img', {
        scrollTrigger: {
          trigger: '.experience-editorial',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: 100,
        scale: 1.1,
        ease: 'none'
      });

      // Navbar Scroll
      gsap.to('.navbar', {
        scrollTrigger: {
          start: 'top -50',
          end: 99999,
          toggleClass: { className: 'nav-scrolled', targets: '.navbar' }
        }
      });

      // Reveal Animations
      gsap.from('.experience-editorial h2, .experience-editorial p', {
        scrollTrigger: {
          trigger: '.experience-editorial',
          start: 'top 75%'
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    return () => {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener('calc-modal-state', handleCalcModalState);
      ctx.revert(); 
      lenis.destroy();
    };

  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOffer(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showOffer || mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [showOffer, mobileMenuOpen]);

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
    if (serviceMenuOpen && !expandedServiceGroup) {
      setExpandedServiceGroup('hair-services');
    }
  }, [serviceMenuOpen, expandedServiceGroup]);

  useEffect(() => {
    if (!serviceMenuOpen || !serviceMenuScrollRef.current || !serviceMenuContentRef.current) {
      return undefined;
    }

    const lenis = new Lenis({
      wrapper: serviceMenuScrollRef.current,
      content: serviceMenuContentRef.current,
      eventsTarget: serviceMenuScrollRef.current,
      wheelEventsTarget: serviceMenuScrollRef.current,
      duration: 0.85,
      lerp: 0.12,
      smoothWheel: true,
      orientation: 'vertical',
    });

    serviceMenuLenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
      serviceMenuLenisRef.current = null;
    };
  }, [serviceMenuOpen]);

  useEffect(() => {
    if (!serviceMenuOpen) {
      return;
    }

    const selectedGroup = serviceGroups.find((group) =>
      group.options.some((option) => option.value === selectedService)
    );

    setExpandedServiceGroup(selectedGroup?.id || 'hair-services');
  }, [selectedService, serviceMenuOpen]);

  useEffect(() => {
    if (!serviceMenuOpen || !selectedService) {
      return undefined;
    }

    const scrollToSelected = () => {
      const target = serviceMenuContentRef.current?.querySelector(
        `[data-service-option="${selectedService}"]`
      );

      if (!target) {
        return;
      }

      const lenis = serviceMenuLenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset: -24 });
      } else {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };

    const rafId = window.requestAnimationFrame(scrollToSelected);
    return () => window.cancelAnimationFrame(rafId);
  }, [selectedService, serviceMenuOpen, expandedServiceGroup]);

  // Cursor Logic
  useEffect(() => {
    const onMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${posX}px`;
        cursorDotRef.current.style.top = `${posY}px`;
      }
      if (cursorOutlineRef.current) {
        gsap.to(cursorOutlineRef.current, {
          x: posX,
          y: posY,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Magnetic Button Logic helper
  const handleMagnetMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    gsap.to(btn.querySelector('.btn-text, button'), { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagnetLeave = (e) => {
    const btn = e.currentTarget;
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to(btn.querySelector('.btn-text, button'), { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  const handleServiceHover = (target) => {
    const bg = document.querySelector(`.service-bg[data-bg="${target}"]`);
    const otherBgs = document.querySelectorAll('.service-bg');

    otherBgs.forEach(b => {
      if (b !== bg) gsap.to(b, { opacity: 0, duration: 0.5 });
    })

    if (bg) {
      gsap.to(bg, { opacity: 1, duration: 0.5, scale: 1.05 });
    } else {
      // Fallback default
      gsap.to(document.querySelector('.service-bg.active-default'), { opacity: 1, duration: 0.5 });
    }
    setActiveService(target);
  };

  const handleServiceLeave = () => {
    const bg = document.querySelector(`.service-bg[data-bg="${activeService}"]`);
    if (bg) gsap.to(bg, { scale: 1, duration: 0.5 });
    // reset to default if desired, or keep last
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    const serviceLabel =
      selectedServiceLabel === 'Select Service'
        ? 'Not selected'
        : selectedServiceLabel;

    const bookingMessage = encodeURIComponent(
      [
        'Hi Dhanya\'s Makeover, I would like to book an appointment.',
        `Name: ${bookingName || 'Not provided'}`,
        `Email: ${bookingEmail || 'Not provided'}`,
        `Service: ${serviceLabel}`,
        `Preferred Date: ${preferredDate || 'Not selected'}`,
      ].join('\n')
    );

    window.open(`https://wa.me/918072966960?text=${bookingMessage}`, '_blank', 'noopener,noreferrer');
  };


  return (
    <>
      <div className="preloader">
        <div className="loader-content">
          <span className="loader-text">DHANYA'S MAKEOVER</span>
          <div className="loader-line"></div>
        </div>
      </div>

      <div className="noise-overlay"></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>

      {showOffer && (
        <div className="offer-modal" role="dialog" aria-modal="true" aria-label="Limited time offer">
          <div className="offer-backdrop" onClick={() => setShowOffer(false)}></div>
          <div className="offer-card">
            <button className="offer-close" aria-label="Close offer" onClick={() => setShowOffer(false)}>
              &#10005;
            </button>
            <span className="offer-kicker">Limited Time</span>
            <h3>Exclusive 50% Offer</h3>
            <p>Reserve a premium session this week and enjoy half off our signature treatments.</p>
            <div className="offer-actions">
              <a href="#contact" className="offer-primary" onClick={() => setShowOffer(false)}>
                Claim Offer
              </a>
              <button className="offer-secondary" onClick={() => setShowOffer(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

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
            <a href="#booking" className="magnetic-btn" onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}>
              <span className="btn-text">Reserve Your Spot</span>
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="line"></div>
        </div>
      </header>

      <section id="offers" className="offer-strip">
        <div className="offer-strip-inner">
          <div className="offer-strip-badge">50% Offer</div>
          <div className="offer-strip-copy">
            Indulge in couture styling, radiance facials, and our holistic spa at half the price.
          </div>
          <a href="#contact" className="offer-strip-cta">Book With 50% Off</a>
        </div>
      </section>

      <section className="offer-highlights">
        <div className="offer-highlights-inner">
          <div className="offer-title">
            <span className="offer-title-kicker">Offer Highlights</span>
            <h2>Luxury, elevated. Prices, halved.</h2>
            <p>Choose a signature treatment and enjoy our limited 50% celebration offer.</p>
          </div>
          <div className="offer-cards">
            <div className="offer-card-mini">
              <div className="offer-card-head">
                <h4>Couture Styling</h4>
                <span className="offer-tag">50% Off</span>
              </div>
              <p>Precision cut, wash, and luxe finish.</p>
              <div className="offer-price">
                <span className="price-old">₹4,500</span>
                <span className="price-new">₹2,250</span>
              </div>
              <a className="offer-card-cta" href="#contact">Reserve</a>
            </div>
            <div className="offer-card-mini">
              <div className="offer-card-head">
                <h4>Radiance Facial</h4>
                <span className="offer-tag">50% Off</span>
              </div>
              <p>Hydrate, lift, and restore your glow.</p>
              <div className="offer-price">
                <span className="price-old">₹6,000</span>
                <span className="price-new">₹3,000</span>
              </div>
              <a className="offer-card-cta" href="#contact">Reserve</a>
            </div>
            <div className="offer-card-mini">
              <div className="offer-card-head">
                <h4>Holistic Spa</h4>
                <span className="offer-tag">50% Off</span>
              </div>
              <p>Full body renewal with aromatherapy.</p>
              <div className="offer-price">
                <span className="price-old">₹8,000</span>
                <span className="price-new">₹4,000</span>
              </div>
              <a className="offer-card-cta" href="#contact">Reserve</a>
            </div>
          </div>
          <div className="offer-note">
            Limited slots available this week. Book now to secure your preferred time.
          </div>
        </div>
      </section>

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

      <section id="services" className="services-list-section">
        <div className="service-bg-container">
          {/* Backgrounds */}
          <div className="service-bg active-default" style={{ backgroundImage: "url('/images/hero.png')", opacity: 1 }}></div>
          <div className="service-bg" data-bg="hair" style={{ backgroundImage: "url('/images/hair.png')" }}></div>
          <div className="service-bg" data-bg="facial" style={{ backgroundImage: "url('/images/facial.png')" }}></div>
          <div className="service-bg" data-bg="spa" style={{ backgroundImage: "url('/images/spa.png')" }}></div>
          <div className="service-bg" data-bg="makeup" style={{ backgroundImage: "url('/images/makeup.png')" }}></div>
        </div>

        <div className="services-content">
          <div className="section-label">Our Service Collection</div>
          <ul className="service-list" onMouseLeave={() => {
            // Optional reset
            const bgs = document.querySelectorAll('.service-bg');
            bgs.forEach(b => gsap.to(b, { opacity: 0, duration: 0.5 }));
            gsap.to(document.querySelector('.service-bg.active-default'), { opacity: 1, duration: 0.5 });
          }}>
            {[
              { id: 'hair', num: '01', name: 'Couture Styling' },
              { id: 'facial', num: '02', name: 'Radiance Facials' },
              { id: 'spa', num: '03', name: 'Holistic Spa' },
              { id: 'makeup', num: '04', name: 'Bridal Artistry' }
            ].map((item, i) => (
              <li key={item.id} className="service-item"
                data-target={item.id}
                onMouseEnter={() => handleServiceHover(item.id)}
                onMouseLeave={handleServiceLeave}
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

      <section id="modes" className="modes-section">
        <div className="modes-inner">
          <div className="section-label">Choose Your Mode</div>
          <div className="modes-grid">
            {[
              {
                id: 'signature',
                title: 'Signature Glow',
                subtitle: 'For radiant days',
                desc: 'A polished styling and skin refresh designed for effortless confidence.'
              },
              {
                id: 'recovery',
                title: 'Recovery Ritual',
                subtitle: 'For deep reset',
                desc: 'Therapeutic care and calming touch to restore balance, body, and mind.'
              },
              {
                id: 'bridal',
                title: 'Bridal Couture',
                subtitle: 'For milestone moments',
                desc: 'Bespoke beauty architecture with premium finishing for your most important events.'
              }
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

      <section id="experience" className="experience-editorial">
        <div className="editorial-content">
          <span className="editorial-subtitle">The Philosophy</span>
          <h2>We believe beauty is an architectural feat.</h2>
          <p>Every cut, every contour, every treatment is designed with the precision of high art. Step into a space
            where time slows down, and the focus is entirely on your restoration.</p>
        </div>
        <div className="editorial-image">
          <img src="/images/hero.png" alt="Interior Detail" />
        </div>
      </section>

      <div className="marquee-container">
        <div className="marquee-content" ref={marqueeRef}>
          {[1, 2, 3, 4].map((i) => (
            <span key={i}>
              <span>Elegance</span> <span className="separator">✦</span>
              <span>Sophistication</span> <span className="separator">✦</span>
              <span>Radiance</span> <span className="separator">✦</span>
              <span>Dhanya's Makeover</span> <span className="separator">✦</span>
            </span>
          ))}
        </div>
      </div>

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
                    onClick={() => setServiceMenuOpen((prev) => !prev)}
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
                        {serviceGroups.map((group) => {
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
                                <div
                                  id={`${group.id}-options`}
                                  className="custom-select-group-options"
                                >
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
                  min={minBookingDate}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              className="magnetic-btn-submit"
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMagnetLeave}
            >
              Book Now on WhatsApp
            </button>
          </form>
        </div>
      </section>

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
      <PriceCalculator />
    </>
  );
}

export default App;

