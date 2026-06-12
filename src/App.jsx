import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import PriceCalculator from './components/PriceCalculator';
import OfferHighlights from './components/OfferHighlights/OfferHighlights';
import {
  BookingSection,
  ExperienceSection,
  FooterSection,
  HeroSection,
  MarqueeSection,
  ModesSection,
  Navbar,
  OfferDetailsSection,
  OfferModal,
  OfferStrip,
  ServicesSection,
} from './components/site/SiteSections';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };

    const handleCalcModalState = (event) => {
      if (event?.detail?.open) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('calc-modal-state', handleCalcModalState);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to('.loader-line', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
        .to('.loader-text', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.in', delay: 0.2 })
        .to('.preloader', { y: '-100%', duration: 1, ease: 'power4.inOut' }, '-=0.4')
        .to('body', { opacity: 1, duration: 0.5 }, '-=0.8')
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
              ease: 'sine.inOut',
            });
          },
        }, '-=1')
        .from('.subtitle', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.5')
        .from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.3')
        .from('.hero p', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.1')
        .from('.cta-wrapper', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.9');

      gsap.to('.scroll-indicator .line', {
        height: '100%',
        y: '100%',
        duration: 1.5,
        repeat: -1,
        ease: 'power2.inOut',
      });

      gsap.to('.scroll-indicator', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '100px top',
          scrub: true,
        },
        opacity: 0,
      });

      gsap.to('.editorial-image img', {
        scrollTrigger: {
          trigger: '.experience-editorial',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: 100,
        scale: 1.1,
        ease: 'none',
      });

      gsap.to('.navbar', {
        scrollTrigger: {
          start: 'top -50',
          end: 99999,
          toggleClass: { className: 'nav-scrolled', targets: '.navbar' },
        },
      });

      gsap.from('.experience-editorial h2, .experience-editorial p', {
        scrollTrigger: {
          trigger: '.experience-editorial',
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
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
    const onMouseMove = (event) => {
      const posX = event.clientX;
      const posY = event.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${posX}px`;
        cursorDotRef.current.style.top = `${posY}px`;
      }

      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.left = `${posX}px`;
        cursorOutlineRef.current.style.top = `${posY}px`;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

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

      <OfferModal />
      <Navbar />
      <HeroSection />
      <OfferStrip />
      <OfferHighlights />
      <OfferDetailsSection />
      <ServicesSection />
      <ModesSection />
      <ExperienceSection />
      <MarqueeSection />
      <BookingSection />
      <FooterSection />
      <PriceCalculator />
    </>
  );
}

export default App;
