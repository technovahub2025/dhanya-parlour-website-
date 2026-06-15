import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function useSiteMotion() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionDuration = prefersReducedMotion ? 0 : 1;
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };

    const handleQuoteModalState = (event) => {
      if (event?.detail?.open) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const handleAnchorClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      const hash = anchor?.getAttribute('href');

      if (!hash || hash === '#') {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      event.preventDefault();

      if (prefersReducedMotion) {
        target.scrollIntoView();
        window.history.replaceState(null, '', hash);
        return;
      }

      lenis.scrollTo(target, {
        duration: 1.25,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        onComplete: () => window.history.replaceState(null, '', hash),
      });
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('quote-modal-state', handleQuoteModalState);
    document.addEventListener('click', handleAnchorClick);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to('.loader-line', { width: '100%', duration: 1.2 * motionDuration, ease: 'power2.inOut' })
        .to('.loader-text', {
          y: prefersReducedMotion ? 0 : -50,
          opacity: 0,
          duration: 0.8 * motionDuration,
          ease: 'power3.in',
          delay: 0.2 * motionDuration,
        })
        .to('.preloader', {
          y: prefersReducedMotion ? 0 : '-100%',
          autoAlpha: 0,
          duration: 1 * motionDuration,
          ease: 'power4.inOut',
        }, prefersReducedMotion ? '>' : '-=0.4')
        .to('body', { opacity: 1, duration: 0.5 * motionDuration }, prefersReducedMotion ? '>' : '-=0.8')
        .from('.hero-bg img', {
          scale: prefersReducedMotion ? 1 : 1.2,
          filter: prefersReducedMotion ? 'none' : 'blur(10px)',
          duration: 2 * motionDuration,
          ease: 'power2.out',
          onComplete: () => {
            if (!prefersReducedMotion) {
              gsap.to('.hero-bg img', {
                scale: 1.1,
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            }
          },
        }, '-=1')
        .from('.subtitle', {
          y: prefersReducedMotion ? 0 : 20,
          opacity: prefersReducedMotion ? 1 : 0,
          duration: 1 * motionDuration,
          ease: 'power3.out',
        }, prefersReducedMotion ? '>' : '-=1.5')
        .from('.hero h1', {
          y: prefersReducedMotion ? 0 : 50,
          opacity: prefersReducedMotion ? 1 : 0,
          duration: 1 * motionDuration,
          ease: 'power3.out',
        }, prefersReducedMotion ? '>' : '-=1.3')
        .from('.hero p', {
          y: prefersReducedMotion ? 0 : 30,
          opacity: prefersReducedMotion ? 1 : 0,
          duration: 1 * motionDuration,
          ease: 'power3.out',
        }, prefersReducedMotion ? '>' : '-=1.1')
        .from('.cta-wrapper', {
          y: prefersReducedMotion ? 0 : 20,
          opacity: prefersReducedMotion ? 1 : 0,
          duration: 1 * motionDuration,
          ease: 'power3.out',
        }, prefersReducedMotion ? '>' : '-=0.9');

      gsap.to('.navbar', {
        scrollTrigger: {
          start: 'top -50',
          end: 99999,
          toggleClass: { className: 'nav-scrolled', targets: '.navbar' },
        },
      });

      if (prefersReducedMotion) {
        gsap.set([
          '.offer-strip-inner',
          '.offer-title',
          '.offer-cards-shell',
          '.offer-details-top',
          '.fact-pill',
          '.offer-detail-card',
          '.service-item',
          '.modes-heading > *',
          '.mode-card',
          '.mode-card-top',
          '.mode-price-row',
          '.mode-benefits',
          '.mode-offer-copy',
          '.mode-cta',
          '.experience-editorial h2',
          '.experience-editorial p',
          '.booking-wrapper h2',
          '.booking-form-minimal > *',
          '.booking-field',
          '.booking-service-category',
          '.booking-final-row > *',
          '.branches-header',
          '.branch-actions a',
          '.branch-card',
          '.footer-col',
          '.footer-col a',
          '.modes-grid-line',
          '.mode-card-surface',
          '.mode-timeline-dot',
        ], { clearProps: 'all' });
        return;
      }

      const reveal = (targets, trigger, options = {}) => {
        const elements = gsap.utils.toArray(targets);
        const y = options.y ?? 14;
        const duration = options.duration ?? 0.55;
        const stagger = options.stagger ?? 0.07;

        const hide = () => {
          gsap.killTweensOf(elements);
          gsap.set(elements, { autoAlpha: 0, y });
        };

        const show = () => {
          gsap.killTweensOf(elements);
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            stagger,
            duration,
            ease: options.ease || 'power3.out',
            overwrite: 'auto',
            onComplete: () => gsap.set(elements, { clearProps: 'transform,opacity,visibility' }),
          });
        };

        hide();
        ScrollTrigger.create({
          trigger,
          start: options.start || 'top 88%',
          end: options.end || 'bottom 8%',
          onEnter: show,
          onEnterBack: show,
          onLeave: hide,
          onLeaveBack: hide,
        });
      };

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

      const timelineCards = gsap.utils.toArray('.mode-card');
      timelineCards.forEach((card) => {
        const surface = card.querySelector('.mode-card-surface');
        const timelineDot = card.querySelector('.mode-timeline-dot');
        const revealTargets = card.querySelectorAll(
          'h3, .mode-subtitle, .mode-price-row, .mode-description, .mode-highlights li, .mode-benefits span, .mode-offer-copy, .mode-cta'
        );
        gsap.set(card, { autoAlpha: 0, y: 84 });
        gsap.set(surface, {
          scale: 0.985,
          '--card-glow-x': '50%',
          '--card-glow-y': '12%',
        });
        gsap.set(revealTargets, { autoAlpha: 0, y: 18 });
        gsap.set(timelineDot, { scale: 0.9 });
      });

      ScrollTrigger.batch(timelineCards, {
        start: 'top 60%',
        interval: 0.12,
        batchMax: 1,
        onEnter: (batch) => {
          batch.forEach((card) => {
            const surface = card.querySelector('.mode-card-surface');
            const timelineDot = card.querySelector('.mode-timeline-dot');
            const revealTargets = card.querySelectorAll(
              'h3, .mode-subtitle, .mode-price-row, .mode-description, .mode-highlights li, .mode-benefits span, .mode-offer-copy, .mode-cta'
            );

            gsap.killTweensOf([card, surface, timelineDot, revealTargets]);
            gsap.timeline({ defaults: { overwrite: 'auto' } })
              .to(card, {
                autoAlpha: 1,
                y: 0,
                duration: 0.68,
                ease: 'power4.out',
              })
              .to(surface, {
                scale: 1,
                duration: 0.5,
                ease: 'power3.out',
              }, '-=0.26')
              .to(timelineDot, {
                scale: 1,
                duration: 0.24,
                ease: 'power2.out',
              }, '-=0.42')
              .to(revealTargets, {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.025,
                ease: 'power2.out',
              }, '-=0.38');
          });
        },
        onEnterBack: (batch) => {
          batch.forEach((card) => {
            const surface = card.querySelector('.mode-card-surface');
            const timelineDot = card.querySelector('.mode-timeline-dot');
            const revealTargets = card.querySelectorAll(
              'h3, .mode-subtitle, .mode-price-row, .mode-description, .mode-highlights li, .mode-benefits span, .mode-offer-copy, .mode-cta'
            );

            gsap.killTweensOf([card, surface, timelineDot, revealTargets]);
            gsap.timeline({ defaults: { overwrite: 'auto' } })
              .to(card, {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: 'power4.out',
              })
              .to(surface, {
                scale: 1,
                duration: 0.42,
                ease: 'power3.out',
              }, '-=0.22')
              .to(timelineDot, {
                scale: 1,
                duration: 0.22,
                ease: 'power2.out',
              }, '-=0.34')
              .to(revealTargets, {
                autoAlpha: 1,
                y: 0,
                duration: 0.34,
                stagger: 0.02,
                ease: 'power2.out',
              }, '-=0.3');
          });
        },
        onLeaveBack: (batch) => {
          batch.forEach((card) => {
            const surface = card.querySelector('.mode-card-surface');
            const timelineDot = card.querySelector('.mode-timeline-dot');
            const revealTargets = card.querySelectorAll(
              'h3, .mode-subtitle, .mode-price-row, .mode-description, .mode-highlights li, .mode-benefits span, .mode-offer-copy, .mode-cta'
            );

            gsap.to(card, {
              autoAlpha: 0,
              y: 84,
              duration: 0.18,
              ease: 'power2.in',
            });
            gsap.to(surface, {
              scale: 0.985,
              duration: 0.18,
              ease: 'power2.in',
            });
            gsap.to(revealTargets, {
              autoAlpha: 0,
              y: 18,
              duration: 0.14,
              stagger: 0.015,
              ease: 'power2.in',
            });
            gsap.to(timelineDot, {
              scale: 0.9,
              duration: 0.14,
              ease: 'power2.in',
            });
          });
        },
      });

      reveal('.offer-strip-inner', '.offer-strip');
      reveal('.offer-title', '.offer-highlights');
      reveal('.offer-cards-shell', '.offer-highlights', { y: 0 });
      reveal('.offer-details-top', '.offer-details');
      reveal('.offer-details-intro > *, .offer-spotlight > *', '.offer-details-top', {
        y: 18,
        stagger: 0.08,
        duration: 0.72,
      });
      reveal('.fact-pill', '.offer-fast-facts', { y: 0 });
      reveal('.offer-detail-card', '.offer-details-grid', { y: 0 });
      reveal('.offer-detail-card h4, .offer-detail-card li, .proof-stats > div, .proof-stats strong, .proof-stats span', '.offer-details-grid', {
        y: 14,
        stagger: 0.04,
        duration: 0.55,
      });
      reveal('.service-item', '.services-list-section', { stagger: 0.06 });
      reveal('.modes-heading > *', '.modes-section', { stagger: 0.08 });
      reveal('.modes-heading h2, .modes-heading > p', '.modes-section', {
        y: 18,
        stagger: 0.08,
        duration: 0.7,
      });
      reveal('.experience-editorial h2, .experience-editorial p', '.experience-editorial', {
        stagger: 0.1,
      });
      reveal('.booking-wrapper h2', '.booking-minimal');
      reveal('.booking-field', '.booking-form-minimal', { y: 10, stagger: 0.07 });
      reveal('.booking-service-category', '.booking-service-list', { y: 8, stagger: 0.04 });
      reveal('.booking-final-row > *', '.booking-final-row', { y: 10, stagger: 0.08 });
      reveal('.branches-header', '.branches-section');
      reveal('.branches-header h2, .branches-header p, .branch-card h3, .branch-card p, .branch-card a', '.branches-section', {
        y: 16,
        stagger: 0.05,
        duration: 0.62,
      });
      reveal('.branch-actions a', '.branch-actions', { y: 8, stagger: 0.04 });
      reveal('.branch-card', '.branches-grid', { y: 0, stagger: 0.08 });
      reveal('.footer-col', 'footer', { stagger: 0.08, start: 'top 92%' });
      reveal('.footer-col h3, .footer-col p, .footer-col a, .footer-note', 'footer', {
        y: 14,
        stagger: 0.05,
        duration: 0.6,
        start: 'top 94%',
      });
      reveal('.footer-col a', '.footer-container', { y: 8, stagger: 0.04, start: 'top 94%' });
    });

    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    return () => {
      gsap.ticker.remove(tickerFn);
      window.removeEventListener('quote-modal-state', handleQuoteModalState);
      document.removeEventListener('click', handleAnchorClick);
      ctx.revert();
      lenis.destroy();
    };
  }, []);
}

