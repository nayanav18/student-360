/* ============================================================
   IntroAnimation — The opening "360" experience
   
   WHAT IT DOES:
   Shows the campus background → tiny glowing point → orbital
   rings form → "360" scales into view → orbiting dots appear
   → fades into Login.
   
   REACT CONCEPTS USED:
   - useEffect: runs the GSAP animation after the DOM is ready
   - useRef: gives GSAP direct access to DOM elements
   - Props: onComplete callback tells App.jsx when intro is done
   
   GSAP: A professional animation library. We use it here
   because CSS animations alone can't chain multiple sequential
   steps with precise timing.
   ============================================================ */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './IntroAnimation.css';

// Campus background image from Unsplash
const CAMPUS_IMAGE = 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=80';

function IntroAnimation({ onComplete }) {
  const containerRef = useRef(null);
  const bgRef        = useRef(null);
  const glowRef      = useRef(null);
  const ring1Ref     = useRef(null);
  const ring2Ref     = useRef(null);
  const ring3Ref     = useRef(null);
  const numRef       = useRef(null);
  const dot1Ref      = useRef(null);
  const dot2Ref      = useRef(null);
  const dot3Ref      = useRef(null);
  const subtitleRef  = useRef(null);

  useEffect(() => {
    // All elements start invisible
    gsap.set([bgRef.current, glowRef.current, ring1Ref.current, ring2Ref.current,
      ring3Ref.current, numRef.current, dot1Ref.current, dot2Ref.current,
      dot3Ref.current, subtitleRef.current], { opacity: 0 });

    // Create a GSAP timeline — steps play one after another
    const tl = gsap.timeline({
      onComplete: () => {
        // After animation completes, fade out the whole container
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete,
        });
      },
    });

    // Step 1: Background fades in
    tl.to(bgRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out' });

    // Step 2: Glowing center point appears
    tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');

    // Step 3: Three orbital rings expand outward
    tl.to(ring1Ref.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.1');
    tl.to(ring2Ref.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');
    tl.to(ring3Ref.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');

    // Step 4: "360" scales into prominence
    tl.to(numRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.3)',
    }, '-=0.3');

    // Step 5: Orbiting dots appear
    tl.to([dot1Ref.current, dot2Ref.current, dot3Ref.current], {
      opacity: 1,
      stagger: 0.15,
      duration: 0.4,
    }, '-=0.2');

    // Step 6: "Student" subtitle fades in
    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.1');

    // Step 7: Hold for 1 second, then the onComplete callback fires
    tl.to({}, { duration: 1.2 });

    return () => tl.kill(); // cleanup if component unmounts
  }, [onComplete]);

  return (
    <div ref={containerRef} className="intro-container">
      {/* Campus background image */}
      <div ref={bgRef} className="intro-bg">
        <img src={CAMPUS_IMAGE} alt="University campus" className="intro-bg-img" />
        <div className="intro-overlay" />
      </div>

      {/* Center stage: orbital rings + 360 number */}
      <div className="intro-stage">
        {/* Orbital rings — CSS animation keeps them spinning */}
        <div ref={ring1Ref} className="intro-ring intro-ring-1" style={{ scale: 0.4 }} />
        <div ref={ring2Ref} className="intro-ring intro-ring-2" style={{ scale: 0.4 }} />
        <div ref={ring3Ref} className="intro-ring intro-ring-3" style={{ scale: 0.4 }} />

        {/* Orbiting dots */}
        <div ref={dot1Ref} className="intro-dot intro-dot-1" />
        <div ref={dot2Ref} className="intro-dot intro-dot-2" />
        <div ref={dot3Ref} className="intro-dot intro-dot-3" />

        {/* Glowing center */}
        <div ref={glowRef} className="intro-glow" style={{ scale: 0.1 }} />

        {/* THE HERO: 360 */}
        <div ref={numRef} className="intro-number" style={{ scale: 0.6 }}>
          360
        </div>
      </div>

      {/* "Student" text below */}
      <div ref={subtitleRef} className="intro-subtitle" style={{ transform: 'translateY(12px)' }}>
        Student
      </div>
    </div>
  );
}

export default IntroAnimation;
