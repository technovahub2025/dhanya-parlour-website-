import { useEffect } from 'react';
import gsap from 'gsap';

export default function useCursorEffects(cursorDotRef, cursorOutlineRef) {
  useEffect(() => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer || !cursorDotRef.current || !cursorOutlineRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reactiveEffectsEnabled = !prefersReducedMotion;
    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    const interactiveSelector = 'a, button, input, [role="button"], .booking-service-chip, .quote-chip';
    const cardSelector = [
      '.offer-card-mini',
      '.offer-detail-card',
      '.offer-spotlight',
      '.mode-card',
      '.branch-card',
      '.fact-pill',
      '.booking-service-picker',
      '.quote-package-chip-card',
    ].join(', ');
    const magneticSelector = [
      '.magnetic-btn',
      '.offer-primary',
      '.offer-strip-cta',
      '.offer-card-cta',
      '.mode-cta',
      '.magnetic-btn-submit',
      '.quote-wa',
      '.quote-fab',
    ].join(', ');
    const magneticMotionCache = new WeakMap();
    const magneticResetTimers = new WeakMap();
    let activeCard = null;
    let activeMagnetic = null;

    const moveDotX = gsap.quickTo(dot, 'left', {
      duration: prefersReducedMotion ? 0 : 0.08,
      ease: 'power3.out',
    });
    const moveDotY = gsap.quickTo(dot, 'top', {
      duration: prefersReducedMotion ? 0 : 0.08,
      ease: 'power3.out',
    });
    const moveOutlineX = gsap.quickTo(outline, 'left', {
      duration: prefersReducedMotion ? 0 : 0.38,
      ease: 'power3.out',
    });
    const moveOutlineY = gsap.quickTo(outline, 'top', {
      duration: prefersReducedMotion ? 0 : 0.38,
      ease: 'power3.out',
    });

    const getMagneticMotion = (element) => {
      magneticResetTimers.get(element)?.kill();

      if (!magneticMotionCache.has(element)) {
        magneticMotionCache.set(element, {
          x: gsap.quickTo(element, 'x', { duration: 0.3, ease: 'power3.out' }),
          y: gsap.quickTo(element, 'y', { duration: 0.3, ease: 'power3.out' }),
        });
      }

      return magneticMotionCache.get(element);
    };

    const resetCard = (element) => {
      if (!element) {
        return;
      }

      element.style.removeProperty('--cursor-x');
      element.style.removeProperty('--cursor-y');
    };

    const resetMagnetic = (element) => {
      if (!element) {
        return;
      }

      const magneticMotion = getMagneticMotion(element);
      magneticMotion.x(0);
      magneticMotion.y(0);

      const resetTimer = gsap.delayedCall(0.45, () => {
        if (activeMagnetic !== element) {
          gsap.set(element, { clearProps: 'x,y' });
        }
      });
      magneticResetTimers.set(element, resetTimer);
    };

    const onMouseMove = (event) => {
      const posX = event.clientX;
      const posY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const cardCandidate = reactiveEffectsEnabled ? target?.closest(cardSelector) : null;
      const magneticCandidate = reactiveEffectsEnabled ? target?.closest(magneticSelector) : null;
      const isPointInside = (element) => {
        if (!element) {
          return false;
        }

        const rect = element.getBoundingClientRect();
        return posX >= rect.left && posX <= rect.right && posY >= rect.top && posY <= rect.bottom;
      };
      const nextCard = isPointInside(cardCandidate) ? cardCandidate : null;
      const nextMagnetic = isPointInside(magneticCandidate) ? magneticCandidate : null;

      document.body.classList.add('cursor-visible');
      moveDotX(posX);
      moveDotY(posY);
      moveOutlineX(posX);
      moveOutlineY(posY);

      if (nextCard !== activeCard) {
        resetCard(activeCard);
        activeCard = nextCard;
      }

      if (activeCard) {
        const rect = activeCard.getBoundingClientRect();
        const localX = Math.min(Math.max((posX - rect.left) / rect.width, 0), 1);
        const localY = Math.min(Math.max((posY - rect.top) / rect.height, 0), 1);

        activeCard.style.setProperty('--cursor-x', `${localX * 100}%`);
        activeCard.style.setProperty('--cursor-y', `${localY * 100}%`);
      }

      if (nextMagnetic !== activeMagnetic) {
        resetMagnetic(activeMagnetic);
        activeMagnetic = nextMagnetic;
      }

      if (activeMagnetic) {
        const rect = activeMagnetic.getBoundingClientRect();
        const offsetX = (posX - rect.left - rect.width / 2) / rect.width;
        const offsetY = (posY - rect.top - rect.height / 2) / rect.height;
        const magneticMotion = getMagneticMotion(activeMagnetic);

        magneticMotion.x(offsetX * 12);
        magneticMotion.y(offsetY * 10);
      }
    };

    const onPointerOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;

      if (reactiveEffectsEnabled && target?.closest(cardSelector)) {
        document.body.classList.add('cursor-card');
      }

      if (target?.closest(interactiveSelector)) {
        document.body.classList.add('cursor-interactive');
      }

      if (target?.closest('input')) {
        document.body.classList.add('cursor-input');
      }
    };

    const onPointerOut = (event) => {
      const nextTarget = event.relatedTarget;
      const nextCard = nextTarget?.closest?.(cardSelector) || null;
      const nextMagnetic = nextTarget?.closest?.(magneticSelector) || null;

      if (!nextCard) {
        document.body.classList.remove('cursor-card');
      }

      if (!nextTarget?.closest?.(interactiveSelector)) {
        document.body.classList.remove('cursor-interactive');
      }

      if (!nextTarget?.closest?.('input')) {
        document.body.classList.remove('cursor-input');
      }

      if (activeCard && nextCard !== activeCard) {
        resetCard(activeCard);
        activeCard = nextCard;
      }

      if (activeMagnetic && nextMagnetic !== activeMagnetic) {
        resetMagnetic(activeMagnetic);
        activeMagnetic = nextMagnetic;
      }
    };

    const onMouseDown = () => document.body.classList.add('cursor-pressed');
    const onMouseUp = () => document.body.classList.remove('cursor-pressed');
    const onMouseLeave = () => {
      document.body.classList.remove('cursor-visible');
      resetCard(activeCard);
      resetMagnetic(activeMagnetic);
      activeCard = null;
      activeMagnetic = null;
    };
    const onMouseEnter = () => document.body.classList.add('cursor-visible');

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      const cardToReset = activeCard;
      const magneticToReset = activeMagnetic;
      activeCard = null;
      activeMagnetic = null;
      resetCard(cardToReset);
      resetMagnetic(magneticToReset);
      document.body.classList.remove(
        'cursor-visible',
        'cursor-interactive',
        'cursor-card',
        'cursor-input',
        'cursor-pressed'
      );
    };
  }, [cursorDotRef, cursorOutlineRef]);
}

