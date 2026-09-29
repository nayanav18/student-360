/* ============================================================
   AcademicCalendar — Compact monthly calendar portraying academic
   schedule, assignments, campus events, and tasks from My Plan
   
   FEATURES:
   - Real-time updates portraying tasks added from My Plan
   - Portrays assignment due dates and registered campus events
   - Top 3 items displayed by default per cell
   - Interactive "+N more" button expands cell to show ALL items (whole list)
   - "Show less ▴" button to collapse back
   - Click-to-add modal removed completely (tasks managed via My Plan)
   - Event pill click navigation to relevant section (Plan, Assignments, Courses, Campus)
   ============================================================ */

import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight,
  BookOpen, CheckSquare, FileText, ClipboardList,
  Calendar, Wrench, Trophy, Umbrella, Ticket, Clock, Tag, Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calendarEvents, assignments, campusEvents } from '../../data/mockData';
import Modal from '../Modal/Modal';
import './AcademicCalendar.css';

/* Icon for each event type */
const TYPE_ICON = {
  class:       <BookOpen      size={10} />,
  task:        <CheckSquare   size={10} />,
  assignment:  <FileText      size={10} />,
  exam:        <ClipboardList size={10} />,
  event:       <Calendar      size={10} />,
  workshop:    <Wrench        size={10} />,
  competition: <Trophy        size={10} />,
  holiday:     <Umbrella      size={10} />,
  deadline:    <Calendar      size={10} />,
  registered:  <Ticket        size={10} />,
};

/* Type label colors */
const TYPE_COLOR = {
  task:        '#10b981',
  class:       '#7c6fe0',
  assignment:  '#ef4444',
  exam:        '#dc2626',
  registered:  '#ec4899',
  event:       '#f59e0b',
  workshop:    '#3b82f6',
  competition: '#8b5cf6',
  holiday:     '#14b8a6',
  deadline:    '#f97316',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* Resilient date parser: handles YYYY-MM-DD, ISO strings, etc. */
function parseDate(str) {
  if (!str) return { year: 0, month: 0, day: 0 };
  const clean = String(str).split('T')[0].trim();
  const parts = clean.split('-').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return { year: parts[0], month: parts[1], day: parts[2] };
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }
  return { year: 0, month: 0, day: 0 };
}

function AcademicCalendar({ onEventClick }) {
  const {
    tasks = [],
    customEvents = [],
    deleteCustomEvent,
    registrations = {},
    assignmentSubmissions = {},
    showToast,
  } = useApp();

  // Start at September 2026 (our baseline today is 2026-09-28)
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState(28);

  // Expanded days state: maps `${year}-${month}-${day}` to boolean
  const [expandedDays, setExpandedDays] = useState({});

  // View event detail modal (only for viewing event metadata if not navigating)
  const [viewingEvent, setViewingEvent] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Combine tasks from My Plan, registered campus events, assignment deadlines, and static calendar events
  const allEvents = useMemo(() => {
    // 1. User tasks from MyPlan — PRIORITY #1 so user's added planning tasks are always first!
    const taskEvents = tasks.map(t => ({
      id: t.id,
      isTask: true,
      type: 'task',
      title: t.title,
      date: t.date,
      time: t.time || 'All Day',
      priority: t.priority,
      completed: t.completed,
      color: TYPE_COLOR.task,
    }));

    // 2. Custom events (if any exist in localStorage)
    const custom = (customEvents || []).map(e => ({
      ...e,
      isCustom: true,
      color: TYPE_COLOR[e.type] || '#5b4fcf',
    }));

    // 3. Registered campus events
    const registeredCampusEvents = (campusEvents || [])
      .filter(ev => registrations && registrations[ev.id])
      .map(ev => ({
        id: `reg-${ev.id}`,
        type: 'registered',
        title: `★ ${ev.title}`,
        date: ev.date,
        time: ev.time || '10:00 AM',
        color: TYPE_COLOR.registered,
      }));

    // 4. Assignment due dates as calendar events
    const assignmentEvents = assignments.map(a => {
      const isSubmitted = Boolean(assignmentSubmissions && assignmentSubmissions[a.id]);
      return {
        id: `asgn-cal-${a.id}`,
        type: 'assignment',
        title: `${isSubmitted ? '✓' : 'Due:'} ${a.title}`,
        date: a.dueDate,
        time: a.dueTime || '11:59 PM',
        color: isSubmitted ? '#10b981' : TYPE_COLOR.assignment,
        completed: isSubmitted,
      };
    });

    return [...taskEvents, ...registeredCampusEvents, ...custom, ...assignmentEvents, ...calendarEvents];
  }, [tasks, customEvents, registrations, assignmentSubmissions]);

  // Build map of day → events for current view month, with user tasks prioritized
  const eventsByDay = useMemo(() => {
    const map = {};
    allEvents.forEach(event => {
      const parsed = parseDate(event.date);
      if (parsed.year === year && parsed.month === month + 1) {
        if (!map[parsed.day]) map[parsed.day] = [];
        map[parsed.day].push(event);
      }
    });

    // Sort events within each day: user tasks first, then registered, then assignments, then schedule
    Object.keys(map).forEach(day => {
      map[day].sort((a, b) => {
        if (a.isTask && !b.isTask) return -1;
        if (!a.isTask && b.isTask) return 1;
        if (a.type === 'registered' && b.type !== 'registered') return -1;
        if (a.type !== 'registered' && b.type === 'registered') return 1;
        if (!a.completed && b.completed) return -1;
        if (a.completed && !b.completed) return 1;
        return 0;
      });
    });

    return map;
  }, [allEvents, year, month]);

  // Build calendar grid (42 cells)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  const today = new Date(2026, 8, 28);
  const isToday = (day) =>
    day.isCurrentMonth &&
    day.day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const navPrev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const navNext = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date(2026, 8, 1));

  const monthName = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const handleDeleteEvent = (event) => {
    if (event.isCustom && deleteCustomEvent) {
      deleteCustomEvent(event.id);
      showToast?.('Event removed from Calendar', 'info');
    }
    setViewingEvent(null);
  };

  const handleToggleExpand = (dayKey, e) => {
    e?.stopPropagation?.();
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  return (
    <div className="academic-calendar">
      {/* Header with Title and Month Nav (No Add Event button as requested) */}
      <div className="cal-header">
        <div className="cal-header-left">
          <h3 className="cal-title">Academic Calendar</h3>
          <span className="cal-event-count-badge">
            {allEvents.length} items
          </span>
        </div>

        <div className="cal-header-right">
          <button
            type="button"
            className="cal-today-btn"
            onClick={goToToday}
            title="Go to Today (Sep 2026)"
          >
            Today
          </button>
          <div className="cal-nav">
            <button type="button" className="cal-nav-btn" onClick={navPrev} aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span className="cal-month-label">{monthName}</span>
            <button type="button" className="cal-nav-btn" onClick={navNext} aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="cal-grid">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}

        {/* Calendar cells */}
        {calendarDays.map((cell, idx) => {
          const events = cell.isCurrentMonth ? (eventsByDay[cell.day] || []) : [];
          const maxVisible = 3;
          const dayKey = `${year}-${month + 1}-${cell.day}`;
          const isExpanded = Boolean(cell.isCurrentMonth && expandedDays[dayKey]);
          const hasMore = events.length > maxVisible;
          const visibleEvents = isExpanded ? events : events.slice(0, maxVisible);

          return (
            <div
              key={idx}
              className={[
                'cal-cell',
                !cell.isCurrentMonth ? 'cal-cell-other' : '',
                isToday(cell) ? 'cal-cell-today' : '',
                cell.isCurrentMonth && selectedDay === cell.day ? 'cal-cell-selected' : '',
                isExpanded ? 'cal-cell-expanded' : '',
                hasMore ? 'cal-cell-expandable' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => {
                if (cell.isCurrentMonth) {
                  setSelectedDay(cell.day);
                  if (hasMore) {
                    handleToggleExpand(dayKey);
                  }
                }
              }}
              role={cell.isCurrentMonth && hasMore ? 'button' : undefined}
              tabIndex={cell.isCurrentMonth && hasMore ? 0 : undefined}
              title={
                cell.isCurrentMonth
                  ? (hasMore ? `Day ${cell.day}: Click to ${isExpanded ? 'collapse' : 'view all ' + events.length + ' events'}` : undefined)
                  : undefined
              }
            >
              <div className="cal-cell-top">
                <span className="cal-cell-number">{cell.day}</span>
                {cell.isCurrentMonth && events.length > 0 && (
                  <span className="cal-cell-count" title={`${events.length} item${events.length === 1 ? '' : 's'}`}>
                    {events.length}
                  </span>
                )}
              </div>

              {/* Events inside the cell */}
              <div className="cal-events">
                {visibleEvents.map((ev, i) => (
                  <button
                    key={ev.id || i}
                    type="button"
                    className={`cal-event ${ev.completed ? 'cal-event-completed' : ''}`}
                    style={{ '--ev-color': ev.color || TYPE_COLOR[ev.type] || '#888' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEventClick) {
                        onEventClick(ev);
                      } else {
                        setViewingEvent(ev);
                      }
                    }}
                    title={`${ev.title} — ${ev.time || 'All Day'}`}
                    aria-label={ev.title}
                  >
                    <span className="cal-event-icon">
                      {ev.completed ? <CheckSquare size={10} /> : (TYPE_ICON[ev.type] || <Calendar size={10} />)}
                    </span>
                    <span className="cal-event-title">{ev.title}</span>
                  </button>
                ))}

                {/* Interactive "+N more" button — clicking expands whole list */}
                {hasMore && !isExpanded && (
                  <button
                    type="button"
                    className="cal-event-more-btn"
                    onClick={(e) => handleToggleExpand(dayKey, e)}
                    aria-label={`Show ${events.length - maxVisible} more events for day ${cell.day}`}
                    title={`Click to show all ${events.length} items`}
                  >
                    +{events.length - maxVisible} more
                  </button>
                )}

                {/* "Show less ▴" button when cell is expanded */}
                {hasMore && isExpanded && (
                  <button
                    type="button"
                    className="cal-event-less-btn"
                    onClick={(e) => handleToggleExpand(dayKey, e)}
                    aria-label={`Show fewer events for day ${cell.day}`}
                    title="Click to collapse"
                  >
                    Show less ▴
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        {Object.entries(TYPE_COLOR).slice(0, 8).map(([type, color]) => (
          <div key={type} className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: color }} />
            <span className="cal-legend-label">{type}</span>
          </div>
        ))}
      </div>

      {/* ── Modal: View Event Details (read-only for inspecting events) ── */}
      {viewingEvent && (
        <Modal
          isOpen={!!viewingEvent}
          onClose={() => setViewingEvent(null)}
          title="Event Details"
          size="sm"
        >
          <div className="cal-view-modal">
            <div className="cal-view-header">
              <span
                className="cal-view-badge"
                style={{
                  background: `${viewingEvent.color || '#5b4fcf'}22`,
                  color: viewingEvent.color || '#5b4fcf'
                }}
              >
                {TYPE_ICON[viewingEvent.type] || <Calendar size={12} />}
                {viewingEvent.type?.toUpperCase()}
              </span>
              <h3 className="cal-view-title">{viewingEvent.title}</h3>
            </div>

            <div className="cal-view-meta">
              <div className="cal-view-meta-row">
                <Calendar size={14} />
                <span>Date: {viewingEvent.date}</span>
              </div>
              <div className="cal-view-meta-row">
                <Clock size={14} />
                <span>Time: {viewingEvent.time || 'All Day'}</span>
              </div>
              {viewingEvent.priority && (
                <div className="cal-view-meta-row">
                  <Tag size={14} />
                  <span>Priority: {viewingEvent.priority}</span>
                </div>
              )}
            </div>

            <div className="cal-view-actions">
              {viewingEvent.isCustom && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteEvent(viewingEvent)}
                >
                  <Trash2 size={13} /> Delete Event
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setViewingEvent(null)}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AcademicCalendar;
