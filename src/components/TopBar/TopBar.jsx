/* ============================================================
   TopBar (Top Navigation Header)
   
   Contains:
   - Hamburger/menu toggle for sidebar on mobile
   - Search bar
   - Theme toggle
   - Profile menu
   ============================================================ */

import { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Menu, Bell, User, Settings, LogOut, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { student, courses, campusEvents, assignments } from '../../data/mockData';
import SearchDropdown from '../SearchBar/SearchDropdown';
import './TopBar.css';

function TopBar({ onMenuToggle, onSignOut, isCollapsed }) {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  // ---- Search state ----
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  // ---- Profile menu state ----
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={`topbar ${isCollapsed ? 'topbar-collapsed' : ''}`}>
      {/* Mobile menu toggle */}
      <button
        className="topbar-menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Search bar — wide, prominent */}
      <div
        className={`topbar-search ${searchFocused ? 'topbar-search-focused' : ''}`}
        ref={searchRef}
      >
        <Search size={16} className="topbar-search-icon" />
        <input
          type="search"
          placeholder="Search Student 360..."
          className="topbar-search-input"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          aria-label="Search"
        />
        {searchQuery && searchFocused && (
          <SearchDropdown
            query={searchQuery}
            onClose={() => { setSearchQuery(''); setSearchFocused(false); }}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* Right side actions */}
      <div className="topbar-actions">
        {/* Theme toggle */}
        <button
          className="topbar-icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification bell (decorative — could be expanded) */}
        <button className="topbar-icon-btn topbar-notif-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="topbar-notif-badge">3</span>
        </button>

        {/* Profile menu */}
        <div className="topbar-profile" ref={profileRef}>
          <button
            className="topbar-avatar-btn"
            onClick={() => setProfileOpen(o => !o)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <div className="topbar-avatar">N</div>
            <div className="topbar-avatar-info">
              <span className="topbar-avatar-name">{student.name}</span>
              <span className="topbar-avatar-roll">{student.rollNumber}</span>
            </div>
          </button>

          {/* Profile dropdown menu */}
          {profileOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">N</div>
                <div>
                  <div className="profile-menu-name">{student.name}</div>
                  <div className="profile-menu-dept">{student.department}</div>
                  <div className="profile-menu-detail">{student.batch} · {student.semester}</div>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <button
                className="profile-menu-item"
                onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                role="menuitem"
              >
                <User size={15} />
                My Profile
              </button>
              <button
                className="profile-menu-item"
                onClick={() => { setProfileOpen(false); }}
                role="menuitem"
              >
                <Edit3 size={15} />
                Edit Details
              </button>
              <button
                className="profile-menu-item"
                onClick={() => { setProfileOpen(false); navigate('/dashboard'); }}
                role="menuitem"
              >
                <Settings size={15} />
                Settings
              </button>

              <div className="profile-menu-divider" />

              {/* Sign Out — belongs in profile menu, NOT sidebar */}
              <button
                className="profile-menu-item profile-menu-signout"
                onClick={() => { setProfileOpen(false); onSignOut(); }}
                role="menuitem"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
