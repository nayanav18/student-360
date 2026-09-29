/* ============================================================
   AcademicCalendar — Compact monthly calendar with interactive event management
   
   FEATURES:
   - Direct "+ Add Event / Task" purple button in header
   - Click on any day cell to add an event directly to that date
   - Real-time updates when adding tasks or events
   - Events mapped from: tasks, assignments, campus events, and custom entries
   - Event detail modal with delete option for custom events
   - Compact layout with icons inside date cells
   ============================================================ */

import { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Trash2,
  BookOpen, CheckSquare, FileText, ClipboardList,
  Calendar, Wrench, Trophy, Umbrella, Ticket, Clock, Tag, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calendarEvents, assignments } from '../../data/mockData';
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

/* Resilient date parser: handles YYYY-MM-DD, ISO strings, etc. */
function parseDate(str) {
  if (!str) return { year: 0, month: 0, day: 0 };
  const clean = String(str).split('T')[0];
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
    tasks,
    addTask,
    customEvents = [],
    addCustomEvent,
    deleteCustomEvent,
    showToast
  } = useApp();

  // Start at September 2026 (our baseline today is 2026-09-28)
  const [viewDate, setViewDate] = useState(new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState(28);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);

  // Add form fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType]   = useState('task');
  const [eventDate, setEventDate]   = useState('2026-09-28');
  const [eventTime, setEventTime]   = useState('10:00 AM');
  const [eventPriority, setEventPriority] = useState('medium');

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Combine static calendar events, custom events, user tasks, and assignment deadlines
  const allEvents = useMemo(() => {
    // 1. User tasks from MyPlan
    const taskEvents = tasks.map(t => ({
      id: t.id,
      isTask: true,
      type: 'task',
      title: t.title,
      date: t.date,
      time: t.time || 'All Day',
      priority: t.priority,
      color: TYPE_COLOR.task,
    }));

    // 2. Custom events added directly from Calendar
    const custom = (customEvents || []).map(e => ({
      ...e,
      isCustom: true,
      color: TYPE_COLOR[e.type] || '#5b4fcf',
    }));

    // 3. Assignment due dates as calendar events
    const assignmentEvents = assignments.map(a => ({
      id: `asgn-cal-${a.id}`,
      type: 'assignment',
      title: `Due: ${a.title}`,
      date: a.dueDate,
      time: a.dueTime || '11:59 PM',
      color: TYPE_COLOR.assignment,
    }));

    return [...calendarEvents, ...custom, ...taskEvents, ...assignmentEvents];
  }, [tasks, customEvents]);

  // Build map of day → events for current view month
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

  const monthName = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // Open Add Modal for a specific date
  const handleOpenAddForDay = (dayNum) => {
    setSelectedDay(dayNum);
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setEventDate(formatted);
    setShowAddModal(true);
  };

  // Submit new event or task
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (eventType === 'task') {
      addTask({
        title: eventTitle.trim(),
        date: eventDate,
        time: eventTime,
        priority: eventPriority,
      });
    } else {
      addCustomEvent({
        title: eventTitle.trim(),
        type: eventType,
        date: eventDate,
        time: eventTime,
      });
    }

    // Auto-navigate calendar view if date is in a different month
    const parsed = parseDate(eventDate);
    if (parsed.year && (parsed.year !== year || parsed.month !== month + 1)) {
      setViewDate(new Date(parsed.year, parsed.month - 1, 1));
    }

    showToast(`Added "${eventTitle.trim()}" to Calendar!`, 'success');
    setEventTitle('');
    setShowAddModal(false);
  };

  const handleDeleteEvent = (event) => {
    if (event.isCustom && deleteCustomEvent) {
      deleteCustomEvent(event.id);
      showToast('Event removed from Calendar', 'info');
    }
    setViewingEvent(null);
  };

  return (
    <div className="academic-calendar">
      {/* Header with Title, Month Nav, and purple Add Event button */}
      <div className="cal-header">
        <div className="cal-header-left">
          <h3 className="cal-title">Academic Calendar</h3>
          <span className="cal-event-count-badge">
            {allEvents.length} events
          </span>
        </div>

        <div className="cal-header-right">
          <div className="cal-nav">
            <button type="button" className="cal-nav-btn" onClick={navPrev} aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span className="cal-month-label">{monthName}</span>
            <button type="button" className="cal-nav-btn" onClick={navNext} aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Prominent purple Add Event / Task button */}
          <button
            type="button"
            className="btn btn-primary btn-sm cal-add-btn"
            onClick={() => {
              const defaultDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
              setEventDate(defaultDate);
              setShowAddModal(true);
            }}
          >
            <Plus size={14} /> Add Event
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
              onClick={() => cell.isCurrentMonth && handleOpenAddForDay(cell.day)}
              role={cell.isCurrentMonth ? 'button' : 'presentation'}
              tabIndex={cell.isCurrentMonth ? 0 : -1}
              title={cell.isCurrentMonth ? `Click day ${cell.day} to add event or view details` : undefined}
            >
              <div className="cal-cell-top">
                <span className="cal-cell-number">{cell.day}</span>
                {cell.isCurrentMonth && (
                  <span className="cal-cell-add-hint">
                    <Plus size={10} />
                  </span>
                )}
              </div>

              {/* Events inside the cell */}
              <div className="cal-events">
                {events.slice(0, maxVisible).map((ev, i) => (
                  <button
                    key={i}
                    type="button"
                    className="cal-event"
                    style={{ '--ev-color': ev.color || TYPE_COLOR[ev.type] || '#888' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingEvent(ev);
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
        {Object.entries(TYPE_COLOR).slice(0, 7).map(([type, color]) => (
          <div key={type} className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: color }} />
            <span className="cal-legend-label">{type}</span>
          </div>
        ))}
      </div>

      {/* ── Modal: Add Event / Task ── */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add to Academic Calendar"
          size="md"
        >
          <form onSubmit={handleCreateEvent} className="cal-modal-form">
            <div className="cal-form-group">
              <label className="cal-form-label">Event / Task Title *</label>
              <input
                type="text"
                className="cal-form-input"
                placeholder="e.g., DBMS Assignment Submission, AI Lab Exam"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="cal-form-row">
              <div className="cal-form-group">
                <label className="cal-form-label">Category</label>
                <select
                  className="cal-form-select"
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                >
                  <option value="task">Personal Task (Green)</option>
                  <option value="class">Class / Lecture (Indigo)</option>
                  <option value="assignment">Assignment Due (Red)</option>
                  <option value="exam">Exam / Quiz (Crimson)</option>
                  <option value="workshop">Workshop (Blue)</option>
                  <option value="competition">Competition (Purple)</option>
                  <option value="event">Campus Event (Amber)</option>
                  <option value="holiday">Holiday (Teal)</option>
                </select>
              </div>

              <div className="cal-form-group">
                <label className="cal-form-label">Date</label>
                <input
                  type="date"
                  className="cal-form-input"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cal-form-row">
              <div className="cal-form-group">
                <label className="cal-form-label">Time</label>
                <input
                  type="text"
                  className="cal-form-input"
                  placeholder="e.g., 10:00 AM"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                />
              </div>

              {eventType === 'task' && (
                <div className="cal-form-group">
                  <label className="cal-form-label">Priority</label>
                  <select
                    className="cal-form-select"
                    value={eventPriority}
                    onChange={e => setEventPriority(e.target.value)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              )}
            </div>

            <div className="cal-modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!eventTitle.trim()}
              >
                <Plus size={14} /> Add to Calendar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal: View Event Details ── */}
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
                {viewingEvent.type.toUpperCase()}
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
