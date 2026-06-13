import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MarqueeSection() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!marqueeRef.current || prefersReducedMotion) {
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
          <span className="marquee-set" key={i}>
            <span className="marquee-item">Bridal Makeup</span>
            <span className="separator">✦</span>
            <span className="marquee-item">HD Makeup</span>
            <span className="separator">✦</span>
            <span className="marquee-item">Airbrush Makeup</span>
            <span className="separator">✦</span>
            <span className="marquee-item">Dhanya Makeup Studio</span>
            <span className="separator">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}


