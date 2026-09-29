/* ============================================================
   Dashboard — The main student workspace
   
   SECTIONS:
   1. Campus Spotlight (auto-rotating events)
   2. Attention Needed + Today's Schedule (side by side)
   3. Academic Calendar (full width)
   
   This page answers: "What matters right now?"
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Clock, ChevronRight,
  BookOpen, FileText, Calendar, CheckCircle,
  BookOpenCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { attendance, assignments, announcements, todaySchedule } from '../../data/mockData';
import CampusSpotlight from '../../components/CampusSpotlight/CampusSpotlight';
import AcademicCalendar from '../../components/AcademicCalendar/AcademicCalendar';
import Modal from '../../components/Modal/Modal';
import './Dashboard.css';

/* ---- Format date ---- */
function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/* ---- Attention Needed Items ---- */
function buildAttentionItems(tasks) {
  const items = [];

  // Low attendance courses (Crimson Red)
  attendance.forEach(a => {
    if (a.percent < 75) {
      items.push({
        id: `att-${a.courseId}`,
        type: 'attendance',
        icon: <BookOpenCheck size={16} />,
        title: `${a.courseName} attendance critical`,
        desc: `${a.percent}% — below 75% minimum`,
        link: '/attendance',
      });
    }
  });

  // Pending assignments (Vibrant Purple - distinct from red): ML Model Evaluation Report (CS601)
  const today = '2026-09-28';
  const pendingAssignments = assignments.filter(a => {
    if (a.status === 'completed') return false;
    return a.id === 'A001' || a.courseCode === 'CS601' || a.dueDate <= '2026-10-06' || a.priority === 'high';
  });

  // Prioritize ML (A001) first, then sort by deadline
  pendingAssignments.sort((a, b) => {
    if (a.id === 'A001' || a.courseCode === 'CS601') return -1;
    if (b.id === 'A001' || b.courseCode === 'CS601') return 1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  pendingAssignments.slice(0, 2).forEach(a => {
    const isDueToday = a.dueDate <= today;
    items.push({
      id: `asgn-${a.id}`,
      type: 'assignment',
      icon: <FileText size={16} />,
      title: `${a.title} due ${isDueToday ? 'today' : 'soon'}`,
      desc: `${a.courseName} — Due ${formatDate(a.dueDate)}`,
      link: `/assignments?open=${a.id}`,
      targetId: a.id,
      openModal: true,
      isAssignment: true,
    });
  });

  // High priority tasks due today (Emerald Green)
  tasks.filter(t => t.date === today && !t.completed && t.priority === 'high').forEach(t => {
    items.push({
      id: `task-${t.id}`,
      type: 'task',
      icon: <CheckCircle size={16} />,
      title: t.title,
      desc: `Personal task — Today at ${t.time}`,
      link: '/plan',
    });
  });

  // Announcements (Warm Amber)
  announcements.filter(a => !a.isRead && a.priority === 'high').slice(0, 2).forEach(a => {
    items.push({
      id: `ann-${a.id}`,
      type: 'announcement',
      icon: <AlertTriangle size={16} />,
      title: a.title,
      desc: a.body.slice(0, 60) + '…',
      link: '/campus',
    });
  });

  return items.slice(0, 6);
}

/* ---- Schedule Item Component ---- */
function ScheduleItem({ item }) {
  const icons = {
    class:      <BookOpen size={14} />,
    assignment: <FileText size={14} />,
    event:      <Calendar size={14} />,
    task:       <CheckCircle size={14} />,
  };

  const statusColors = {
    completed: 'var(--success)',
    upcoming:  'var(--accent-primary)',
    current:   'var(--warning)',
    reminder:  'var(--info)',
  };

  return (
    <div className={`schedule-item schedule-${item.status}`}>
      <div className="schedule-time">
        <span>{item.time}</span>
      </div>
      <div
        className="schedule-dot"
        style={{ background: statusColors[item.status] || 'var(--text-tertiary)' }}
      />
      <div className="schedule-info">
        <div className="schedule-icon-wrap">
          {icons[item.type] || <Calendar size={14} />}
        </div>
        <div>
          <div className="schedule-title">{item.title}</div>
          {item.room && (
            <div className="schedule-room">{item.room}</div>
          )}
          {item.endTime && (
            <div className="schedule-room">Ends {item.endTime}</div>
          )}
        </div>
      </div>
      {item.status === 'completed' && (
        <CheckCircle size={14} className="schedule-done-icon" />
      )}
    </div>
  );
}

/* ============================================================
   Main Dashboard component
   ============================================================ */
function Dashboard() {
  const { tasks } = useApp();
  const navigate  = useNavigate();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const attentionItems = buildAttentionItems(tasks);

  // Current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      {/* Page header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">{greeting}, Nayana</h1>
          <p className="dashboard-date">
            Monday, 28 September 2026 · Semester 6
          </p>
        </div>
        <div className="dashboard-quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-value">8.74</span>
            <span className="quick-stat-label">CGPA</span>
          </div>
          <div className="quick-stat-divider" />
          <div className="quick-stat">
            <span className="quick-stat-value" style={{ color: 'var(--warning)' }}>3</span>
            <span className="quick-stat-label">Pending</span>
          </div>
          <div className="quick-stat-divider" />
          <div className="quick-stat">
            <span className="quick-stat-value" style={{ color: attentionItems.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {attentionItems.length}
            </span>
            <span className="quick-stat-label">Alerts</span>
          </div>
        </div>
      </div>

      {/* Campus Spotlight */}
      <CampusSpotlight onEventClick={setSelectedEvent} />

      {/* Middle section: Attention + Schedule */}
      <div className="dashboard-middle">
        {/* Attention Needed */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">
              <AlertTriangle size={16} />
              Attention Needed
            </h2>
            <span className="dash-panel-count">{attentionItems.length}</span>
          </div>
          <div className="attention-list">
            {attentionItems.length === 0 ? (
              <div className="dash-empty">
                <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                <p>All caught up! Nothing needs attention right now.</p>
              </div>
            ) : (
              attentionItems.map(item => (
                <button
                  key={item.id}
                  className={`attention-item attention-${item.type}`}
                  onClick={() => {
                    if (item.openModal) {
                      navigate(item.link, { state: { openAssignmentId: item.targetId || 'A001' } });
                    } else if (item.isAssignment || item.link?.includes('/assignments')) {
                      navigate('/assignments?open=A001', { state: { openAssignmentId: 'A001' } });
                    } else {
                      navigate(item.link);
                    }
                  }}
                >
                  <span className="attention-icon">{item.icon}</span>
                  <div className="attention-text">
                    <div className="attention-title">{item.title}</div>
                    <div className="attention-desc">{item.desc}</div>
                  </div>
                  <ChevronRight size={14} className="attention-arrow" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">
              <Clock size={16} />
              Today's Schedule
            </h2>
            <span className="dash-date-badge">Sep 28</span>
          </div>
          <div className="schedule-list">
            {todaySchedule.map(item => (
              <ScheduleItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Academic Calendar */}
      <AcademicCalendar onEventClick={(ev) => {
        if (ev.type === 'task') navigate('/plan');
        else if (ev.type === 'class') navigate('/courses');
        else if (ev.type === 'assignment') navigate('/assignments');
        else if (['event', 'workshop', 'competition', 'registered'].includes(ev.type)) navigate('/campus');
      }} />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          size="lg"
          showClose
        >
          <div className="event-detail-modal">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="event-modal-image"
            />
            <div className="event-modal-content">
              <span className="badge badge-accent">{selectedEvent.category}</span>
              <h2 className="event-modal-title">{selectedEvent.title}</h2>
              <p className="event-modal-desc">{selectedEvent.description}</p>
              <div className="event-modal-meta">
                <div><Calendar size={14} /> {formatDate(selectedEvent.date)}</div>
                <div>📍 {selectedEvent.location}</div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => { setSelectedEvent(null); navigate('/campus'); }}
              >
                View on Campus Page
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;
