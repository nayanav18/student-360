/* ============================================================
   App.jsx — The root application component
   
   WHAT THIS FILE DOES:
   App.jsx is the "brain" of the application. It controls which
   screen the user sees by managing the application's phase:
   
   'intro'    → IntroAnimation (opening 360 experience)
   'login'    → Login page
   'welcome'  → WelcomeTransition (post-login skeleton)
   'app'      → Main application with sidebar + routing
   
   STATE MANAGED HERE:
   - phase: which screen is active
   - sidebarCollapsed: whether the sidebar is collapsed
   
   WHY NOT USE ROUTER FOR LOGIN?
   The intro/login/welcome flow is NOT route-based because it's
   a sequential one-way flow, not navigation. Routes are used
   inside the main 'app' phase for the actual pages.
   ============================================================ */

import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// ---- Phase components ----
import IntroAnimation    from './components/IntroAnimation/IntroAnimation';
import Login             from './pages/Login/Login';
import WelcomeTransition from './components/WelcomeTransition/WelcomeTransition';

// ---- Layout components ----
import Sidebar  from './components/Sidebar/Sidebar';
import TopBar   from './components/TopBar/TopBar';
import { ToastContainer } from './components/Toast/Toast';

// ---- Pages ----
import Dashboard   from './pages/Dashboard/Dashboard';
import Attendance  from './pages/Attendance/Attendance';
import MyPlan      from './pages/MyPlan/MyPlan';
import Courses     from './pages/Courses/Courses';
import Performance from './pages/Performance/Performance';
import Assignments from './pages/Assignments/Assignments';
import Campus      from './pages/Campus/Campus';
import Notes       from './pages/Notes/Notes';

// ---- Styles ----
import './App.css';

/* ============================================================
   MainApp — The authenticated application shell.
   Rendered after login, contains sidebar + topbar + pages.
   ============================================================ */
function MainApp({ onSignOut }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarCollapsed(c => !c);

  return (
    <div className="app-layout">
      {/* Fixed left sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content area */}
      <main className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Fixed top header — adjusts position with sidebar */}
        <TopBar
          onMenuToggle={toggleSidebar}
          onSignOut={onSignOut}
          isCollapsed={sidebarCollapsed}
        />

        {/* Page content — scrollable area below topbar */}
        <div className="page-content">
          <Routes>
            {/* Default redirect to dashboard */}
            <Route path="/"            element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/attendance"  element={<Attendance />} />
            <Route path="/plan"        element={<MyPlan />} />
            <Route path="/courses"     element={<Courses />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/campus"      element={<Campus />} />
            <Route path="/notes"       element={<Notes />} />
            {/* Catch-all: redirect unknown routes to dashboard */}
            <Route path="*"            element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      {/* Global toast notification container */}
      <ToastContainer />
    </div>
  );
}

/* ============================================================
   App — Root component, manages the application phase
   ============================================================ */
function App() {
  // 'intro' | 'login' | 'welcome' | 'app'
  const [phase, setPhase] = useState('intro');

  return (
    <div className="app-wrapper">
      {/* PHASE 1: Opening animation */}
      {phase === 'intro' && (
        <IntroAnimation onComplete={() => setPhase('login')} />
      )}

      {/* PHASE 2: Login */}
      {phase === 'login' && (
        <Login onLoginSuccess={() => setPhase('welcome')} />
      )}

      {/* PHASE 3: Welcome + skeleton loading */}
      {phase === 'welcome' && (
        <WelcomeTransition onComplete={() => setPhase('app')} />
      )}

      {/* PHASE 4: Main application */}
      {phase === 'app' && (
        <MainApp onSignOut={() => setPhase('login')} />
      )}
    </div>
  );
}

export default App;
