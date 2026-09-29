/* ============================================================
   Assignments Page
   
   Features:
   - Filter tabs: All / Upcoming / Pending / Completed (with purple active highlights)
   - Two-column grid of assignment cards
   - Detail modal with REAL local file upload from local system
   - Pre-uploaded dummy files completely removed
   - Submissions persisted via AppContext & localStorage
   - Rich purple buttons & badges
   ============================================================ */

import { useState, useRef } from 'react';
import {
  FileText, Calendar, Clock, ChevronRight, AlertCircle,
  CheckCircle, CheckCircle2, BookOpen, Paperclip, UploadCloud,
  FolderOpen, Trash2, FileCheck, ArrowUpRight
} from 'lucide-react';
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
  if (diff < 0)   return { label: 'Overdue', urgent: true };
  if (diff === 0) return { label: 'Due today', urgent: true };
  if (diff === 1) return { label: 'Due tomorrow', urgent: true };
  return { label: `${diff} days left`, urgent: false };
}

/* Individual assignment card */
function AssignmentCard({ assignment, isCompleted, submission, onClick }) {
  const course  = courses.find(c => c.id === assignment.courseId);
  const dueInfo = daysUntil(assignment.dueDate);
  const currentStatus = isCompleted ? 'completed' : assignment.status;

  const p = PRIORITY[assignment.priority] || PRIORITY.medium;
  const s = STATUS[currentStatus] || STATUS.pending;

  return (
    <div
      className="asgn-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Course color strip */}
      <div className="asgn-strip" style={{ background: course?.color || 'var(--accent-primary)' }} />

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
          <div className={`asgn-due ${dueInfo.urgent && !isCompleted ? 'asgn-due-urgent' : ''}`}>
            <Calendar size={12} />
            {formatDate(assignment.dueDate)} · {assignment.dueTime}
          </div>
          <div className={`asgn-countdown ${dueInfo.urgent && !isCompleted ? 'asgn-countdown-urgent' : ''}`}>
            {isCompleted ? 'Submitted' : dueInfo.label}
          </div>
        </div>

        <div className="asgn-marks">
          <span>{assignment.marks} marks</span>
          {submission?.files?.length > 0 ? (
            <span className="asgn-attach asgn-attach-uploaded">
              <FileCheck size={12} /> {submission.files.length} file(s) uploaded
            </span>
          ) : (
            <span className="asgn-attach">
              <UploadCloud size={12} /> Ready to upload
            </span>
          )}
          <ChevronRight size={14} className="asgn-arrow" />
        </div>
      </div>
    </div>
  );
}

/* Detail modal with Local File Upload */
function AssignmentDetailModal({ assignment, onClose }) {
  const {
    assignmentSubmissions = {},
    submitAssignment,
    removeAssignmentSubmission,
    showToast
  } = useApp();

  const fileInputRef = useRef(null);
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging]   = useState(false);

  if (!assignment) return null;

  const course     = courses.find(c => c.id === assignment.courseId);
  const dueInfo    = daysUntil(assignment.dueDate);
  const submission = assignmentSubmissions[assignment.id];
  const isSubmitted = !!submission;

  // Handle files selected from the local computer
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const formatted = files.map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      type: f.type || 'Document',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setStagedFiles(prev => [...prev, ...formatted]);
    showToast(`Loaded ${files.length} file(s) from local system`, 'info');
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const formatted = files.map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.type || 'Document',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setStagedFiles(prev => [...prev, ...formatted]);
      showToast(`Added ${files.length} file(s) from local computer`, 'info');
    }
  };

  const removeStagedFile = (idx) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Final submission action
  const handleFinalSubmit = () => {
    if (stagedFiles.length === 0) {
      showToast('Please select at least one file from your computer to submit', 'warning');
      return;
    }

    submitAssignment(assignment.id, {
      files: stagedFiles,
      submittedDate: '2026-09-29',
    });

    showToast(`Assignment "${assignment.title}" submitted successfully!`, 'success');
    onClose();
  };

  const handleUnsubmit = () => {
    removeAssignmentSubmission(assignment.id);
    setStagedFiles([]);
    showToast('Assignment unsubmitted. You can now re-upload files.', 'info');
  };

  return (
    <Modal isOpen={!!assignment} onClose={onClose} title="Assignment Submission" size="lg">
      <div className="asgn-detail">
        {/* Header */}
        <div className="asgn-detail-header" style={{ borderColor: course?.color || 'var(--accent-primary)' }}>
          <div className="asgn-detail-meta">
            <span className="badge badge-accent">{assignment.courseCode}</span>
            <span className={`asgn-priority ${PRIORITY[assignment.priority]?.className}`}>
              {PRIORITY[assignment.priority]?.label} Priority
            </span>
            {isSubmitted && (
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> Submitted
              </span>
            )}
          </div>
          <h2 className="asgn-detail-title">{assignment.title}</h2>
          <div className="asgn-detail-course">
            <BookOpen size={14} /> {assignment.courseName}
          </div>
        </div>

        {/* Description */}
        <div className="asgn-detail-section">
          <div className="asgn-detail-section-label">Instructions & Requirements</div>
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
            <div className={`asgn-detail-info-value ${dueInfo.urgent && !isSubmitted ? 'text-danger' : ''}`}>
              {isSubmitted ? 'Completed' : dueInfo.label}
            </div>
          </div>
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Total Marks</div>
            <div className="asgn-detail-info-value">{assignment.marks} pts</div>
          </div>
          <div className="asgn-detail-info-card">
            <div className="asgn-detail-info-label">Format</div>
            <div className="asgn-detail-info-value" style={{ fontSize: '13px' }}>
              {assignment.submissionType}
            </div>
          </div>
        </div>

        {/* ── REAL LOCAL SYSTEM FILE UPLOAD SECTION ── */}
        <div className="asgn-detail-section">
          <div className="asgn-detail-section-label">
            {isSubmitted ? 'Submitted Files' : 'Upload Submission (From Local System)'}
          </div>

          {/* Hidden local file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            style={{ display: 'none' }}
          />

          {isSubmitted ? (
            /* Already submitted banner */
            <div className="asgn-submitted-box">
              <div className="asgn-submitted-head">
                <CheckCircle2 size={24} className="asgn-submitted-check" />
                <div>
                  <div className="asgn-submitted-title">Work Successfully Submitted</div>
                  <div className="asgn-submitted-sub">
                    Submitted on {submission.submittedDate || 'Sep 29, 2026'}
                  </div>
                </div>
              </div>

              <div className="asgn-file-list">
                {submission.files?.map((file, i) => (
                  <div key={i} className="asgn-file-item asgn-file-item-done">
                    <Paperclip size={15} />
                    <span className="asgn-file-name">{file.name}</span>
                    <span className="asgn-file-size">{file.size}</span>
                  </div>
                ))}
              </div>

              <div className="asgn-submitted-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleUnsubmit}
                >
                  Unsubmit & Replace Files
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Local Upload Dropzone */
            <div className="asgn-upload-container">
              <div
                className={`asgn-dropzone ${isDragging ? 'asgn-dropzone-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="asgn-dropzone-left">
                  <div className="asgn-dropzone-icon-wrap">
                    <UploadCloud size={20} />
                  </div>
                  <div className="asgn-dropzone-text-group">
                    <div className="asgn-dropzone-main">
                      <strong>Upload from local system</strong> or drag files here
                    </div>
                    <div className="asgn-dropzone-sub">
                      PDF, DOCX, ZIP, PY, IPYNB, SQL (Max 25MB)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary asgn-browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FolderOpen size={15} /> Browse Local Files
                </button>
              </div>

              {/* List of staged local files ready to submit */}
              {stagedFiles.length > 0 && (
                <div className="asgn-staged-section">
                  <div className="asgn-staged-header">
                    <span>Ready to submit ({stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''})</span>
                    <button
                      type="button"
                      className="asgn-clear-all"
                      onClick={() => setStagedFiles([])}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="asgn-file-list">
                    {stagedFiles.map((file, i) => (
                      <div key={i} className="asgn-file-item">
                        <Paperclip size={15} className="asgn-file-icon" />
                        <div className="asgn-file-info">
                          <span className="asgn-file-name">{file.name}</span>
                          <span className="asgn-file-size">{file.size}</span>
                        </div>
                        <button
                          type="button"
                          className="asgn-file-remove-btn"
                          onClick={() => removeStagedFile(i)}
                          title="Remove file"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions with purple buttons */}
        <div className="asgn-detail-actions">
          {!isSubmitted ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFinalSubmit}
            >
              <FileCheck size={18} /> Submit Assignment
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary asgn-submit-action-btn"
              onClick={onClose}
            >
              Close
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary asgn-ask-action-btn"
            onClick={() => {
              showToast(`Question regarding "${assignment.title}" sent to faculty`, 'info');
            }}
          >
            Ask Faculty
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---- Main page ---- */
function Assignments() {
  const { assignmentSubmissions = {} } = useApp();
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  const FILTERS = [
    { key: 'all',         label: 'All' },
    { key: 'pending',     label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed',   label: 'Completed' },
  ];

  // Dynamically resolve assignment status with user's submissions
  const enrichedAssignments = assignments.map(a => {
    const isSubmitted = !!assignmentSubmissions[a.id];
    return {
      ...a,
      status: isSubmitted ? 'completed' : a.status,
    };
  });

  const filtered = filter === 'all'
    ? enrichedAssignments
    : enrichedAssignments.filter(a => a.status === filter);

  // Sort by urgency, completed last
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const pendingCount = enrichedAssignments.filter(a => a.status !== 'completed').length;

  return (
    <div className="assignments-page">
      <div>
        <h1 className="page-title">Assignments</h1>
        <p className="page-subtitle">
          {pendingCount} pending · {enrichedAssignments.length - pendingCount} completed
        </p>
      </div>

      {/* Filter tabs with rich purple active styling */}
      <div className="asgn-filters">
        {FILTERS.map(f => {
          const count = f.key === 'all'
            ? enrichedAssignments.length
            : enrichedAssignments.filter(a => a.status === f.key).length;

          return (
            <button
              key={f.key}
              type="button"
              className={`asgn-filter-tab ${filter === f.key ? 'asgn-filter-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="asgn-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Two-column grid */}
      {sorted.length === 0 ? (
        <div className="asgn-empty">
          <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          <p>No assignments found in this view</p>
        </div>
      ) : (
        <div className="asgn-grid">
          {sorted.map(a => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              isCompleted={a.status === 'completed'}
              submission={assignmentSubmissions[a.id]}
              onClick={() => setSelected(a)}
            />
          ))}
        </div>
      )}

      {/* Detail & Local Upload Modal */}
      <AssignmentDetailModal
        assignment={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default Assignments;
