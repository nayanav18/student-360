/* ============================================================
   Attendance Page
   
   Shows compact attendance cards per course.
   Cards show: course name, %, progress bar, status badge.
   ============================================================ */

import { attendance, courses } from '../../data/mockData';
import './Attendance.css';

/* Calculate how many classes can be missed before hitting 75% */
function calcMissable(attended, total) {
  // If attended/total >= 0.75 → we can miss X more
  // attended / (total + X) = 0.75 → X = attended/0.75 - total
  const canMiss = Math.floor(attended / 0.75 - total);
  return Math.max(0, canMiss);
}

/* How many classes needed to reach 75% */
function calcNeeded(attended, total) {
  // (attended + X) / (total + X) = 0.75
  // attended + X = 0.75*total + 0.75*X → 0.25*X = 0.75*total - attended
  // X = (0.75*total - attended) / 0.25
  const needed = Math.ceil((0.75 * total - attended) / 0.25);
  return Math.max(0, needed);
}

function AttendanceCard({ record }) {
  const course = courses.find(c => c.id === record.courseId);
  const isLow  = record.percent < 75;
  const isMed  = record.percent >= 75 && record.percent < 80;

  const status = isLow ? 'critical' : isMed ? 'warning' : 'good';
  const statusLabel = { critical: 'Critical', warning: 'Low', good: 'Good' }[status];

  const canMiss = calcMissable(record.attended, record.total);
  const needed  = calcNeeded(record.attended, record.total);

  return (
    <div className={`att-card att-${status}`}>
      {/* Color strip on left */}
      <div className="att-card-stripe" style={{ background: course?.color || 'var(--accent-primary)' }} />

      <div className="att-card-body">
        <div className="att-card-top">
          <div>
            <div className="att-course-code">{record.code}</div>
            <div className="att-course-name">{record.courseName}</div>
            <div className="att-faculty">{course?.faculty}</div>
          </div>
          <div className="att-percent-wrap">
            <div className={`att-percent att-percent-${status}`}>{record.percent}%</div>
            <div className={`badge badge-${status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'danger'}`}>
              {statusLabel}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="att-progress-wrap">
          <div className="att-progress-bg">
            <div
              className={`att-progress-fill att-fill-${status}`}
              style={{ width: `${record.percent}%` }}
            />
            {/* 75% threshold marker */}
            <div className="att-threshold-marker" title="75% minimum" />
          </div>
          <div className="att-progress-label">
            {record.attended}/{record.total} classes
          </div>
        </div>

        {/* Status message */}
        <div className="att-status-msg">
          {isLow
            ? `Need ${needed} more class${needed !== 1 ? 'es' : ''} to reach 75%`
            : canMiss > 0
            ? `You can miss ${canMiss} more class${canMiss !== 1 ? 'es' : ''}`
            : 'At the minimum threshold — don\'t miss any more'}
        </div>
      </div>
    </div>
  );
}

function Attendance() {
  // Overall attendance average
  const overall = Math.round(
    attendance.reduce((sum, a) => sum + a.percent, 0) / attendance.length
  );

  const critical = attendance.filter(a => a.percent < 75).length;
  const warning  = attendance.filter(a => a.percent >= 75 && a.percent < 80).length;
  const good     = attendance.filter(a => a.percent >= 80).length;

  return (
    <div className="attendance-page">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track your presence across all courses</p>
        </div>
        <div className="att-overall">
          <div className="att-overall-number">{overall}%</div>
          <div className="att-overall-label">Overall Average</div>
        </div>
      </div>

      {/* Summary pills */}
      <div className="att-summary">
        <div className="att-summary-pill att-pill-danger">
          <span>{critical}</span> Critical
        </div>
        <div className="att-summary-pill att-pill-warning">
          <span>{warning}</span> Low
        </div>
        <div className="att-summary-pill att-pill-success">
          <span>{good}</span> Good
        </div>
        <div className="att-summary-rule">
          Minimum required: <strong>75%</strong>
        </div>
      </div>

      {/* Cards grid */}
      <div className="att-grid">
        {attendance
          .slice()
          .sort((a, b) => a.percent - b.percent) // critical first
          .map(record => (
            <AttendanceCard key={record.courseId} record={record} />
          ))}
      </div>
    </div>
  );
}

export default Attendance;
