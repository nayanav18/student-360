/* ============================================================
   Assignments Page
   
   Two-column grid of assignment cards.
   Filter tabs: All / Upcoming / Pending / Completed
   Clicking a card opens a rich detail modal.
   ============================================================ */

import { useState } from 'react';
import { FileText, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle, BookOpen, Paperclip } from 'lucide-react';
import { assignments, courses } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal/Modal';
import './Assignments.css';

/* Priority styles */
const PRIORITY = {
  high:   { label: 'High',   className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low:    { label: 'Low',    className: 'priority-low' },
};

/* Status styles */
const STATUS = {
  pending:     { label: 'Pending',     icon: <Clock size={12} />,        className: 'status-pending' },
  'in-progress':{ label: 'In Progress', icon: <AlertCircle size={12} />, className: 'status-progress' },
  completed:   { label: 'Completed',   icon: <CheckCircle size={12} />, className: 'status-completed' },
};

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr) {
  const today = new Date('2026-09-28');
  const due   = new Date(dateStr);
  const diff  = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0)  return { label: 'Overdue', urgent: true };
  if (diff === 0) return { label: 'Due today', urgent: true };
  if (diff === 1) return { label: 'Due tomorrow', urgent: true };
  return { label: `${diff} days left`, urgent: false };
};

/* Individual assignment card */
function AssignmentCard({ assignment, onClick }) {
  const course  = courses.find(c => c.id === assignment.courseId);
  const dueInfo = daysUntil(assignment.dueDate);
  const p = PRIORITY[assignment.priority] || PRIORITY.medium;
  const s = STATUS[assignment.status]    || STATUS.pending;

  return (
    <div
      className="asgn-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Course color strip */}
      <div className="asgn-strip" style={{ background: course?.color }} />

      <div className="asgn-body">
        <div className="asgn-top">
          <div className={`asgn-priority ${p.className}`}>{p.label}</div>
          <div className={`asgn-status ${s.className}`}>
            {s.icon} {s.label}
          </div>
        </div>

        <h3 className="asgn-title">{assignment.title}</h3>

        <div className="asgn-course">
          <BookOpen size={12} />
          {assignment.courseName} · {assignment.courseCode}
        </div>

        <div className="asgn-footer">
          <div className={`asgn-due ${dueInfo.urgent ? 'asgn-due-urgent' : ''}`}>
            <Calendar size={12} />
            {formatDate(assignment.dueDate)} · {assignment.dueTime}
          </div>
          <div className={`asgn-countdown ${dueInfo.urgent ? 'asgn-countdown-urgent' : ''}`}>
            {dueInfo.label}
          </div>
        </div>

        <div className="asgn-marks">
          <span>{assignment.marks} marks</span>
          {assignment.attachments?.length > 0 && (
            <span className="asgn-attach">
              <Paperclip size={11} /> {assignment.attachments.length} files
            </span>
          )}
          <ChevronRight size={14} className="asgn-arrow" />
        </div>
      </div>
    </div>
  );
}

/* Detail modal */
function AssignmentDetailModal({ assignment, onClose }) {
  const { showToast } = useApp();
  if (!assignment) return null;
  const course  = courses.find(c => c.id === assignment.courseId);
  const dueInfo = daysUntil(assignment.dueDate);

  return (
    <Modal isOpen={!!assignment} onClose={onClose} title="Assignment Details" size="lg">
      <div className="asgn-detail">
        {/* Header */}
        <div className="asgn-detail-header" style={{ borderColor: course?.color }}>
          <div className="asgn-detail-meta">
            <span className="badge badge-accent">{assignment.courseCode}</span>
            <span className={`asgn-priority ${PRIORITY[assignment.priority]?.className}`}>
              {PRIORITY[assignment.priority]?.label} Priority
            </span>
          </div>
          <h2 className="asgn-detail-title">{assignment.title}</h2>
          <div className="asgn-detail-course">
            <BookOpen size={14} /> {assignment.courseName}
          </div>
        </div>

        {/* Description */}
        <div className="asgn-detail-section">
          <div className="asgn-detail-section-label">Description</div>
          <p className="asgn-detail-desc">{assignment.description}</p>
        </div>

        {/* Due date and submission */}
        <div className="asgn-detail-grid">
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Due Date</div>
            <div className="asgn-detail-info-value">{formatDate(assignment.dueDate)}</div>
            <div className="asgn-detail-info-sub">{assignment.dueTime}</div>
          </div>
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Time Remaining</div>
            <div className={`asgn-detail-info-value ${dueInfo.urgent ? 'text-danger' : ''}`}>{dueInfo.label}</div>
          </div>
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Marks</div>
            <div className="asgn-detail-info-value">{assignment.marks}</div>
          </div>
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Submission</div>
            <div className="asgn-detail-info-value" style={{ fontSize: '13px' }}>{assignment.submissionType}</div>
          </div>
        </div>

        {/* Attachments */}
        {assignment.attachments?.length > 0 && (
          <div className="asgn-detail-section">
            <div className="asgn-detail-section-label">Attachments</div>
            <div className="asgn-attachments">
              {assignment.attachments.map((file, i) => (
                <div key={i} className="asgn-attach-item">
                  <Paperclip size={14} />
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="asgn-detail-actions">
          <button
            className="btn btn-primary"
            onClick={() => { showToast('Submission portal opened', 'success'); onClose(); }}
          >
            Submit Assignment
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => { showToast('Question sent to instructor', 'info'); }}
          >
            Ask Question
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---- Main page ---- */
function Assignments() {
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  const FILTERS = [
    { key: 'all',        label: 'All' },
    { key: 'pending',    label: 'Pending' },
    { key: 'in-progress',label: 'In Progress' },
    { key: 'completed',  label: 'Completed' },
  ];

  const filtered = filter === 'all'
    ? assignments
    : assignments.filter(a => a.status === filter);

  // Sort by due date (closest first), completed last
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className="assignments-page">
      <div>
        <h1 className="page-title">Assignments</h1>
        <p className="page-subtitle">{assignments.filter(a => a.status !== 'completed').length} pending · {assignments.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="asgn-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`asgn-filter-tab ${filter === f.key ? 'asgn-filter-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="asgn-filter-count">
              {f.key === 'all' ? assignments.length : assignments.filter(a => a.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Two-column grid */}
      {sorted.length === 0 ? (
        <div className="asgn-empty">
          <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          <p>No assignments in this view</p>
        </div>
      ) : (
        <div className="asgn-grid">
          {sorted.map(a => (
            <AssignmentCard key={a.id} assignment={a} onClick={() => setSelected(a)} />
          ))}
        </div>
      )}

      <AssignmentDetailModal assignment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default Assignments;
