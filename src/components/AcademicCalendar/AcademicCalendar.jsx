/* ============================================================
   AcademicCalendar — Compact monthly calendar with events inside dates
   
   IMPORTANT DESIGN DECISIONS:
   - Events appear INSIDE the calendar date cells (not below)
   - Each event type has a distinct icon
   - Clicking an event opens relevant details
   - The calendar stays compact — no wasted vertical space
   
   REACT CONCEPTS:
   - useMemo: expensive date calculations only re-run when month changes
   - State: currentDate for month navigation, selectedDate for selection
   ============================================================ */

import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight,
  BookOpen, CheckSquare, FileText, ClipboardList,
  Calendar, Wrench, Trophy, Umbrella, Ticket
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calendarEvents } from '../../data/mockData';
import './AcademicCalendar.css';

/* Icon for each event type */
const TYPE_ICON = {
  class:       <BookOpen     size={10} />,
  task:        <CheckSquare  size={10} />,
  assignment:  <FileText     size={10} />,
  exam:        <ClipboardList size={10} />,
  event:       <Calendar     size={10} />,
  workshop:    <Wrench       size={10} />,
  competition: <Trophy       size={10} />,
  holiday:     <Umbrella     size={10} />,
  deadline:    <Calendar     size={10} />,
  registered:  <Ticket       size={10} />,
};

/* Type label colors — used for the colored dot/pill */
const TYPE_COLOR = {
  class:       '#7c6fe0',
  task:        '#22c55e',
  assignment:  '#ef4444',
  exam:        '#dc2626',
  event:       '#f59e0b',
  workshop:    '#3b82f6',
  competition: '#8b5cf6',
  holiday:     '#14b8a6',
  deadline:    '#f97316',
  registered:  '#ec4899',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* Format "2026-10-15" → { year:2026, month:10, day:15 } */
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function AcademicCalendar({ onEventClick }) {
  const { tasks } = useApp();
  // Start at September 2026 (our "today" is 2026-09-28)
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 1)); // month is 0-indexed
  const [selectedDay, setSelectedDay] = useState(28); // today

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Combine static calendar events with user's tasks
  const allEvents = useMemo(() => {
    const taskEvents = tasks.map(t => ({
      id: t.id,
      type: 'task',
      title: t.title,
      date: t.date,
      time: t.time,
      color: TYPE_COLOR.task,
    }));
    return [...calendarEvents, ...taskEvents];
  }, [tasks]);

  // Build a map of day → events for the current month
  const eventsByDay = useMemo(() => {
    const map = {};
    allEvents.forEach(event => {
      const parsed = parseDate(event.date);
      if (parsed.year === year && parsed.month === month + 1) {
        if (!map[parsed.day]) map[parsed.day] = [];
        map[parsed.day].push(event);
      }
    });
    return map;
  }, [allEvents, year, month]);

  // Build calendar grid (6 rows × 7 cols)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month's days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }

    // Next month's leading days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const today = new Date(2026, 8, 28); // Our "today"
  const isToday = (day) =>
    day.isCurrentMonth &&
    day.day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const navPrev = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const navNext = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const monthName = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="academic-calendar">
      {/* Header with navigation */}
      <div className="cal-header">
        <h3 className="cal-title">Academic Calendar</h3>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={navPrev} aria-label="Previous month">
            <ChevronLeft size={15} />
          </button>
          <span className="cal-month-label">{monthName}</span>
          <button className="cal-nav-btn" onClick={navNext} aria-label="Next month">
            <ChevronRight size={15} />
          </button>
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

          return (
            <div
              key={idx}
              className={[
                'cal-cell',
                !cell.isCurrentMonth ? 'cal-cell-other' : '',
                isToday(cell) ? 'cal-cell-today' : '',
                cell.isCurrentMonth && selectedDay === cell.day ? 'cal-cell-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => cell.isCurrentMonth && setSelectedDay(cell.day)}
              role={cell.isCurrentMonth ? 'button' : 'presentation'}
              tabIndex={cell.isCurrentMonth ? 0 : -1}
            >
              <span className="cal-cell-number">{cell.day}</span>

              {/* Events inside the cell */}
              <div className="cal-events">
                {events.slice(0, maxVisible).map((ev, i) => (
                  <button
                    key={i}
                    className="cal-event"
                    style={{ '--ev-color': ev.color || TYPE_COLOR[ev.type] || '#888' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick && onEventClick(ev);
                    }}
                    title={`${ev.title} — ${ev.time || 'All Day'}`}
                    aria-label={ev.title}
                  >
                    <span className="cal-event-icon">
                      {TYPE_ICON[ev.type] || <Calendar size={10} />}
                    </span>
                    <span className="cal-event-title">{ev.title}</span>
                  </button>
                ))}
                {events.length > maxVisible && (
                  <span className="cal-event-more">+{events.length - maxVisible} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        {Object.entries(TYPE_COLOR).slice(0, 6).map(([type, color]) => (
          <div key={type} className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: color }} />
            <span className="cal-legend-label">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcademicCalendar;
