/* ============================================================
   SearchDropdown — Live search results dropdown
   Appears when the user types in the search bar.
   Results are grouped by category.
   ============================================================ */

import { useMemo } from 'react';
import { FileText, BookOpen, Building2, NotebookPen, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { courses, campusEvents, assignments } from '../../data/mockData';
import './SearchDropdown.css';

/* Category definitions */
const CATEGORIES = [
  {
    id: 'assignments',
    label: 'Assignments',
    icon: <FileText size={14} />,
    route: '/assignments',
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: <BookOpen size={14} />,
    route: '/courses',
  },
  {
    id: 'events',
    label: 'Campus Events',
    icon: <Building2 size={14} />,
    route: '/campus',
  },
  {
    id: 'notes',
    label: 'My Notes',
    icon: <NotebookPen size={14} />,
    route: '/notes',
  },
  {
    id: 'tasks',
    label: 'My Tasks',
    icon: <ClipboardList size={14} />,
    route: '/plan',
  },
];

function SearchDropdown({ query, onClose, onNavigate }) {
  const { notes, tasks } = useApp();
  const q = query.toLowerCase().trim();

  // Build search results using useMemo to avoid recomputing on every render
  const results = useMemo(() => {
    if (!q) return {};

    return {
      assignments: assignments.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.courseName.toLowerCase().includes(q)
      ).slice(0, 3),
      courses: courses.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.faculty.toLowerCase().includes(q)
      ).slice(0, 3),
      events: campusEvents.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      ).slice(0, 3),
      notes: notes.filter(n =>
        n.title.toLowerCase().includes(q)
      ).slice(0, 3),
      tasks: tasks.filter(t =>
        t.title.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [q, notes, tasks]);

  const totalResults = Object.values(results).flat().length;

  const handleItemClick = (route) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="search-dropdown" role="listbox" aria-label="Search results">
      {totalResults === 0 ? (
        <div className="search-empty">
          <span className="search-empty-icon">🔍</span>
          <p>No results for "{query}"</p>
          <small>Try searching for a course, assignment, or event</small>
        </div>
      ) : (
        CATEGORIES.map(({ id, label, icon, route }) => {
          const items = results[id];
          if (!items || items.length === 0) return null;

          return (
            <div key={id} className="search-group">
              <div className="search-group-label">
                {icon}
                {label}
              </div>
              {items.map((item, idx) => (
                <button
                  key={idx}
                  className="search-item"
                  onClick={() => handleItemClick(route)}
                  role="option"
                >
                  <span className="search-item-title">
                    {item.title || item.name}
                  </span>
                  {item.courseCode && (
                    <span className="search-item-meta">{item.courseCode}</span>
                  )}
                  {item.dueDate && (
                    <span className="search-item-meta">Due {item.dueDate}</span>
                  )}
                  {item.category && (
                    <span className="search-item-meta">{item.category}</span>
                  )}
                </button>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

export default SearchDropdown;
