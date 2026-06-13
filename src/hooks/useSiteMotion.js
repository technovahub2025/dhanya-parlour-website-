import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

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
          '.offer-card-mini',
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

      reveal('.offer-strip-inner', '.offer-strip');
      reveal('.offer-title', '.offer-highlights');
      reveal('.offer-card-mini', '.offer-cards-shell', { y: 0 });
      reveal('.offer-details-top', '.offer-details');
      reveal('.fact-pill', '.offer-fast-facts', { y: 0 });
      reveal('.offer-detail-card', '.offer-details-grid', { y: 0 });
      reveal('.service-item', '.services-list-section', { stagger: 0.06 });
      reveal('.modes-heading > *', '.modes-section', { stagger: 0.08 });
      reveal('.mode-card', '.modes-grid', { y: 0, stagger: 0.08 });
      reveal(
        '.mode-card-top, .mode-price-row, .mode-benefits, .mode-offer-copy, .mode-cta',
        '.modes-grid',
        { y: 8, stagger: 0.025, duration: 0.4 }
      );
      reveal('.experience-editorial h2, .experience-editorial p', '.experience-editorial', {
        stagger: 0.1,
      });
      reveal('.booking-wrapper h2', '.booking-minimal');
      reveal('.booking-field', '.booking-form-minimal', { y: 10, stagger: 0.07 });
      reveal('.booking-service-category', '.booking-service-list', { y: 8, stagger: 0.04 });
      reveal('.booking-final-row > *', '.booking-final-row', { y: 10, stagger: 0.08 });
      reveal('.branches-header', '.branches-section');
      reveal('.branch-actions a', '.branch-actions', { y: 8, stagger: 0.04 });
      reveal('.branch-card', '.branches-grid', { y: 0, stagger: 0.08 });
      reveal('.footer-col', 'footer', { stagger: 0.08, start: 'top 92%' });
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

