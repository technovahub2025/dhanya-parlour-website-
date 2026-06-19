import { forwardRef, useEffect, useRef } from 'react';
import './MagneticCta.css';

const MAGNETIC_RESET_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const MAX_TRANSLATE = 14;

function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function MagneticCta(props, forwardedRef) {
  const {
    className = '',
    children,
    shineVariant = 'gold',
    magneticStrength = 0.25,
    ...elementProps
  } = props;
  const Tag = props.as || 'a';
  const elementRef = useRef(null);

  const setRefs = (node) => {
    elementRef.current = node;

    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
      return;
    }

    if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  useEffect(() => {
    const element = elementRef.current;

    if (!element || !hasFinePointer()) {
      return undefined;
    }

    let rafId = 0;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const updateTransform = (event) => {
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      const translateX = clamp(offsetX * magneticStrength, -MAX_TRANSLATE, MAX_TRANSLATE);
      const translateY = clamp(offsetY * magneticStrength, -MAX_TRANSLATE, MAX_TRANSLATE);

      element.style.setProperty('--magnetic-x', `${translateX}px`);
      element.style.setProperty('--magnetic-y', `${translateY}px`);
      element.style.setProperty('--magnetic-scale', '1.05');
      element.style.transition = 'none';
    };

    const resetTransform = () => {
      window.cancelAnimationFrame(rafId);
      element.style.setProperty('--magnetic-x', '0px');
      element.style.setProperty('--magnetic-y', '0px');
      element.style.setProperty('--magnetic-scale', '1');
      element.style.transition = `transform 0.4s ${MAGNETIC_RESET_EASING}`;
    };

    const setShineActive = (active) => {
      element.dataset.shineActive = String(active);
    };

    const onMouseMove = (event) => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => updateTransform(event));
    };

    const onMouseEnter = () => {
      setShineActive(false);
      window.requestAnimationFrame(() => setShineActive(true));
    };

    const onMouseLeave = () => {
      resetTransform();
      setShineActive(false);
    };

    const onMouseDown = () => {
      element.style.setProperty('--magnetic-scale', '0.94');
      element.style.transition = 'transform 0.1s ease';
    };

    const onMouseUp = () => {
      element.style.setProperty('--magnetic-scale', element.matches(':hover') ? '1.05' : '1');
      element.style.transition = `transform 0.4s ${MAGNETIC_RESET_EASING}`;
    };

    element.addEventListener('mousemove', onMouseMove, { passive: true });
    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.cancelAnimationFrame(rafId);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      resetTransform();
      setShineActive(false);
    };
  }, [magneticStrength]);

  return (
    <Tag
      {...elementProps}
      ref={setRefs}
      className={`${className} magnetic-cta magnetic-cta--${shineVariant}`.trim()}
      data-shine-active="false"
    >
      <span className="magnetic-cta-content">{children}</span>
      <span className="magnetic-cta-shine" aria-hidden="true" />
    </Tag>
  );
}

export default forwardRef(MagneticCta);
