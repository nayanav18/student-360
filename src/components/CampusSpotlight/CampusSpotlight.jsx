/* ============================================================
   CampusSpotlight — Continuous Left-Sliding Featured Events Carousel
   
   FEATURES:
   - Always slides to the left on auto-rotation (seamless infinite loop)
   - Smooth continuous horizontal slide transition
   - Subtle automatic image zoom (1.00 → 1.045) on active slide
   - Left/right arrow controls & interactive pagination dots
   - Hover pauses automatic sliding
   ============================================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { campusEvents } from '../../data/mockData';
import './CampusSpotlight.css';

// Only show featured/first few events in spotlight
const SPOTLIGHT_EVENTS = campusEvents.filter(e => e.featured).concat(
  campusEvents.filter(e => !e.featured).slice(0, 2)
).slice(0, 5);

// Infinite loop: append a clone of the first slide at the end
const EXTENDED_SLIDES = [...SPOTLIGHT_EVENTS, SPOTLIGHT_EVENTS[0]];

// Format date nicely: "2026-10-15" → "Oct 15, 2026"
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CampusSpotlight({ onEventClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered]       = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timerRef = useRef(null);

  // Advance forward (slides to the left)
  const goNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, []);

  // Go backward (slides to the right)
  const goPrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(prev => {
      if (prev === 0) {
        return SPOTLIGHT_EVENTS.length - 1;
      }
      return prev - 1;
    });
  }, []);

  // When transition ends, if we reached the cloned slide, instantly reset to index 0 without animation
  const handleTransitionEnd = () => {
    if (currentIndex >= SPOTLIGHT_EVENTS.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable transition right after instant reset
  useEffect(() => {
    if (!isTransitioning) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(resetTimer);
    }
  }, [isTransitioning]);

  // Auto-rotate every 5 seconds by sliding to the left
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(goNext, 5000);
    return () => clearTimeout(timerRef.current);
  }, [currentIndex, isHovered, goNext]);

  // Active dot index (mod length so clone maps to dot 0)
  const activeDotIndex = currentIndex % SPOTLIGHT_EVENTS.length;

  return (
    <div
      className="spotlight"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Campus Spotlight"
    >
      {/* Sliding track — slides to the left as currentIndex advances */}
      <div
        className="spotlight-track"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        {EXTENDED_SLIDES.map((event, idx) => {
          const isActive = idx === currentIndex || (idx === 0 && currentIndex === SPOTLIGHT_EVENTS.length);
          return (
            <div key={`${event.id}-${idx}`} className="spotlight-slide">
              {/* Background image with slow zoom when active */}
              <div className="spotlight-slide-img-wrap">
                <img
                  src={event.image}
                  alt={event.title}
                  className={`spotlight-image ${isActive ? 'spotlight-image-active' : ''}`}
                  loading="lazy"
                />
                <div className="spotlight-gradient" />
              </div>

              {/* Slide content: text + actions slide smoothly along with image */}
              <div className="spotlight-content">
                <div className="spotlight-tag">{event.category}</div>
                <h2 className="spotlight-title">{event.title}</h2>
                <p className="spotlight-desc">{event.shortDescription}</p>

                <div className="spotlight-meta">
                  <span className="spotlight-meta-item">
                    <Calendar size={14} />
                    {formatDate(event.date)}
                  </span>
                  <span className="spotlight-meta-item">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                </div>

                <div className="spotlight-actions">
                  <button
                    type="button"
                    className="spotlight-btn-primary"
                    onClick={() => onEventClick(event)}
                  >
                    View Details
                  </button>
                  {event.registrationDeadline && (
                    <span className="spotlight-deadline">
                      Register by {formatDate(event.registrationDeadline)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persistent Arrow controls */}
      <button
        type="button"
        className="spotlight-arrow spotlight-arrow-left"
        onClick={goPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        className="spotlight-arrow spotlight-arrow-right"
        onClick={goNext}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Persistent Dot indicators */}
      <div className="spotlight-dots" role="tablist">
        {SPOTLIGHT_EVENTS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`spotlight-dot ${idx === activeDotIndex ? 'spotlight-dot-active' : ''}`}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            role="tab"
            aria-selected={idx === activeDotIndex}
          />
        ))}
      </div>
    </div>
  );
}

export default CampusSpotlight;
