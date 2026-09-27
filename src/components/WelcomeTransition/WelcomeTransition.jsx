/* ============================================================
   Welcome Transition — shown after login, before dashboard
   
   Shows "Welcome back, Nayana" + skeleton loading
   ============================================================ */

import { useEffect, useState } from 'react';
import './WelcomeTransition.css';

function WelcomeTransition({ onComplete }) {
  const [phase, setPhase] = useState('welcome'); // 'welcome' | 'skeleton'

  useEffect(() => {
    // After 1.8 seconds, switch to skeleton
    const t1 = setTimeout(() => setPhase('skeleton'), 1800);
    // After 3.5 more seconds, transition to actual app
    const t2 = setTimeout(() => onComplete(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div className="welcome-container">
      {phase === 'welcome' ? (
        <WelcomeMessage />
      ) : (
        <SkeletonDashboard />
      )}
    </div>
  );
}

/* "Welcome back, Nayana" message */
function WelcomeMessage() {
  return (
    <div className="welcome-message">
      <div className="welcome-avatar">N</div>
      <div className="welcome-text">
        <p className="welcome-greeting">Welcome back,</p>
        <h1 className="welcome-name">Nayana</h1>
        <p className="welcome-sub">Preparing your workspace…</p>
      </div>
    </div>
  );
}

/* Realistic skeleton that matches the dashboard layout */
function SkeletonDashboard() {
  return (
    <div className="skeleton-dashboard">
      {/* Top bar skeleton */}
      <div className="skel-topbar">
        <div className="skeleton skel-search" />
        <div className="skeleton skel-avatar" />
      </div>

      <div className="skel-body">
        {/* Sidebar skeleton */}
        <div className="skel-sidebar">
          <div className="skeleton skel-logo" />
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton skel-nav-item" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="skel-content">
          {/* Campus Spotlight */}
          <div className="skeleton skel-spotlight" />

          <div className="skel-row">
            {/* Attention Needed */}
            <div className="skel-col">
              <div className="skeleton skel-section-title" />
              {[1,2,3].map(i => (
                <div key={i} className="skeleton skel-card" />
              ))}
            </div>

            {/* Today's Schedule */}
            <div className="skel-col">
              <div className="skeleton skel-section-title" />
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton skel-schedule-item" />
              ))}
            </div>

            {/* Calendar */}
            <div className="skel-col skel-col-narrow">
              <div className="skeleton skel-section-title" />
              <div className="skeleton skel-calendar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeTransition;
