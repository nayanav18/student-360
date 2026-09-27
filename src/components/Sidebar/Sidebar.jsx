/* ============================================================
   Sidebar Component
   
   The left navigation panel. Can collapse to show only icons.
   
   FIX: When collapsed, clicking the "360" logo expands sidebar.
   The toggle button is now always visible (in brand area).
   ============================================================ */

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, ClipboardList,
  BookOpen, BarChart2, FileText, Building2,
  NotebookPen, ChevronLeft, ChevronRight
} from 'lucide-react';
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
      {/* ── Brand / logo area ──
          When EXPANDED: shows "360 Student" text + collapse chevron button.
          When COLLAPSED: the entire brand area becomes a clickable button
          that expands the sidebar again (clicking "360" brings it back).
      */}
      {isCollapsed ? (
        /* Collapsed: whole brand row is a button → click to expand */
        <button
          type="button"
          className="sidebar-brand sidebar-brand-collapsed-btn"
          onClick={onToggle}
          aria-label="Expand sidebar (Click 360)"
          title="Click to expand sidebar"
        >
          <span className="sidebar-brand-icon">360</span>
          <ChevronRight size={13} className="sidebar-expand-chevron" />
        </button>
      ) : (
        /* Expanded: brand text on the left, collapse button on the right */
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-number">360</span>
            <span className="sidebar-brand-name">Student</span>
          </div>
          <button
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
