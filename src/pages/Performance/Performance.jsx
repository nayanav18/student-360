/* ============================================================
   Performance Page
   
   Shows CGPA, semester grades, course-wise marks.
   Uses clean visual hierarchy — numbers are hero elements.
   ============================================================ */

import { marks, cgpaHistory, courses, student } from '../../data/mockData';
import './Performance.css';

/* Map grade → color */
const GRADE_COLORS = {
  'A+': '#22c55e', 'A': '#22c55e', 'B+': '#3b82f6',
  'B':  '#60a5fa', 'C': '#f59e0b', 'F': '#ef4444',
};

/* Simple horizontal bar for marks */
function MarkBar({ value, max, color = 'var(--accent-primary)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mark-bar-wrap">
      <div className="mark-bar-bg">
        <div className="mark-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="mark-bar-label">{value}/{max}</span>
    </div>
  );
}

/* CGPA trend — simple visual bars */
function CGPATrend() {
  const max = 10;
  return (
    <div className="cgpa-trend">
      {cgpaHistory.map(s => (
        <div key={s.semester} className={`trend-col ${s.current ? 'trend-col-current' : ''}`}>
          <div className="trend-value">{s.cgpa}</div>
          <div className="trend-bar-wrap">
            <div
              className="trend-bar"
              style={{ height: `${(s.cgpa / max) * 100}%`, background: s.current ? 'var(--accent-primary)' : 'var(--border-medium)' }}
            />
          </div>
          <div className="trend-label">{s.semester.replace('Sem ', 'S')}</div>
        </div>
      ))}
    </div>
  );
}

function Performance() {
  const totalCredits   = courses.reduce((s, c) => s + c.credits, 0);
  const earnedPoints   = marks.reduce((s, m) => s + m.gradePoints * (courses.find(c => c.id === m.courseId)?.credits || 0), 0);
  const semGPA         = (earnedPoints / totalCredits).toFixed(2);

  return (
    <div className="performance-page">
      <div>
        <h1 className="page-title">Performance</h1>
        <p className="page-subtitle">Academic grades, marks and progress</p>
      </div>

      {/* Top stats row */}
      <div className="perf-stats">
        <div className="perf-stat-card perf-stat-main">
          <div className="perf-stat-label">Cumulative GPA</div>
          <div className="perf-stat-big">{student.cgpa}</div>
          <div className="perf-stat-sub">out of 10.0</div>
          <div className="perf-cgpa-bar">
            <div className="perf-cgpa-fill" style={{ width: `${(student.cgpa / 10) * 100}%` }} />
          </div>
        </div>

        <div className="perf-stat-card">
          <div className="perf-stat-label">Semester GPA</div>
          <div className="perf-stat-big" style={{ color: 'var(--success)' }}>{semGPA}</div>
          <div className="perf-stat-sub">Semester 6</div>
        </div>

        <div className="perf-stat-card">
          <div className="perf-stat-label">Credits Completed</div>
          <div className="perf-stat-big" style={{ color: 'var(--info)' }}>{student.completedCredits}</div>
          <div className="perf-stat-sub">of {student.totalCredits} total</div>
        </div>

        <div className="perf-stat-card">
          <div className="perf-stat-label">Current Semester</div>
          <div className="perf-stat-big" style={{ color: 'var(--warning)' }}>{totalCredits}</div>
          <div className="perf-stat-sub">credits enrolled</div>
        </div>
      </div>

      {/* CGPA Trend */}
      <div className="card card-padded perf-trend-card">
        <h3 className="perf-section-title">CGPA Progression</h3>
        <CGPATrend />
      </div>

      {/* Course-wise marks table */}
      <div className="card card-padded">
        <h3 className="perf-section-title">Semester 6 — Course-wise Marks</h3>
        <div className="marks-table">
          {/* Header */}
          <div className="marks-row marks-header">
            <div>Course</div>
            <div>CIA 1</div>
            <div>CIA 2</div>
            <div>Assignment</div>
            <div>Mid-Sem</div>
            <div>Grade</div>
          </div>

          {marks.map(m => {
            const course = courses.find(c => c.id === m.courseId);
            const gradeColor = GRADE_COLORS[m.grade] || 'var(--text-secondary)';
            return (
              <div key={m.courseId} className="marks-row">
                <div className="marks-course">
                  <span className="marks-course-dot" style={{ background: course?.color }} />
                  <span>{m.courseName}</span>
                </div>
                <div>
                  <MarkBar value={m.cia1} max={m.maxCIA} color={course?.color} />
                </div>
                <div>
                  <MarkBar value={m.cia2} max={m.maxCIA} color={course?.color} />
                </div>
                <div>
                  <MarkBar value={m.assignment} max={m.maxAssignment} color={course?.color} />
                </div>
                <div>
                  <MarkBar value={m.midterm} max={m.maxMid} color={course?.color} />
                </div>
                <div>
                  <span className="marks-grade" style={{ color: gradeColor, borderColor: gradeColor + '44' }}>
                    {m.grade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="marks-note">* Final examinations scheduled for November 2026</p>
      </div>
    </div>
  );
}

export default Performance;
