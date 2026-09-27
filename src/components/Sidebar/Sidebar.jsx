/* ============================================================
   Sidebar Component
   
   The left navigation panel. Can collapse to show only icons.
   Uses the modern BrandLogo emblem for both expanded and collapsed states.
   ============================================================ */

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, ClipboardList,
  BookOpen, BarChart2, FileText, Building2,
  NotebookPen, ChevronLeft
} from 'lucide-react';
import BrandLogo from '../BrandLogo/BrandLogo';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/attendance',  icon: CalendarCheck,   label: 'Attendance' },
  { path: '/plan',        icon: ClipboardList,   label: 'My Plan' },
  { path: '/courses',     icon: BookOpen,        label: 'Courses' },
  { path: '/performance', icon: BarChart2,       label: 'Performance' },
  { path: '/assignments', icon: FileText,        label: 'Assignments' },
  { path: '/campus',      icon: Building2,       label: 'Campus' },
  { path: '/notes',       icon: NotebookPen,     label: 'My Notes' },
];

function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      aria-label="Main navigation"
    >
      {/* ── Brand / Header Area ──
          When COLLAPSED: renders a sleek clickable BrandLogo button to expand.
          When EXPANDED: renders BrandLogo + Student 360 typography + collapse toggle.
      */}
      {isCollapsed ? (
        <button
          type="button"
          className="sidebar-brand sidebar-brand-collapsed-btn"
          onClick={onToggle}
          aria-label="Expand sidebar"
          title="Click to expand sidebar"
        >
          <BrandLogo size={36} isCollapsed />
        </button>
      ) : (
        <div className="sidebar-brand">
          <div className="sidebar-brand-wrapper">
            <BrandLogo size={32} />
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">Student</span>
              <span className="sidebar-brand-number">360</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Navigation links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            title={isCollapsed ? label : undefined}
          >
            <Icon size={20} className="sidebar-link-icon" />
            {!isCollapsed && (
              <span className="sidebar-link-label">{label}</span>
            )}
            {location.pathname === path && (
              <span className="sidebar-active-dot" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer — only when expanded */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-label">Semester 6 · Section A</span>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
