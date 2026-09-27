/* ============================================================
   BrandLogo — Student 360 Emblem & Icon
   
   A high-fidelity vector brand emblem featuring:
   - Modern squircle container with indigo/violet gradient
   - Precision 360° orbital trajectory ring & celestial core node
   - Bold geometric "360" typographic mark
   - Subtle outer glow and interactive hover physics
   ============================================================ */

import './BrandLogo.css';

function BrandLogo({ size = 36, isCollapsed = false, className = '' }) {
  return (
    <div
      className={`brand-logo-badge ${isCollapsed ? 'brand-logo-collapsed' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-label="Student 360"
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-svg"
      >
        <defs>
          {/* Surface gradient */}
          <linearGradient id="s360BrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6355e7" />
            <stop offset="50%" stopColor="#7565ed" />
            <stop offset="100%" stopColor="#8b7cf6" />
          </linearGradient>

          {/* Orbital arc gradient */}
          <linearGradient id="s360OrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>

          {/* Core glow filter */}
          <filter id="s360Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4338ca" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Base squircle */}
        <rect
          width="40"
          height="40"
          rx="11"
          fill="url(#s360BrandGrad)"
          filter="url(#s360Glow)"
        />

        {/* Inner highlight border */}
        <rect
          x="0.75"
          y="0.75"
          width="38.5"
          height="38.5"
          rx="10.25"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1.5"
        />

        {/* 360 degree orbital ring */}
        <circle
          cx="20"
          cy="20"
          r="14.5"
          stroke="url(#s360OrbitGrad)"
          strokeWidth="1.8"
          strokeDasharray="64 24"
          strokeLinecap="round"
          className="brand-orbit-ring"
        />

        {/* Orbiting focal node */}
        <circle cx="28" cy="8" r="2.2" fill="#ffffff" className="brand-orbit-dot" />

        {/* Hero 360 mark */}
        <text
          x="20"
          y="25.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="13"
          fontWeight="800"
          letterSpacing="-0.6px"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          className="brand-logo-text"
        >
          360
        </text>
      </svg>
    </div>
  );
}

export default BrandLogo;
