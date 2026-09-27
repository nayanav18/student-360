/* ============================================================
   Courses Page
   
   Compact course cards with details modal.
   ============================================================ */

import { useState } from 'react';
import { BookOpen, User, Clock, ChevronRight } from 'lucide-react';
import { courses } from '../../data/mockData';
import Modal from '../../components/Modal/Modal';
import './Courses.css';

/* Days and their abbreviation */
const DAY_ABBR = { Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed', Thursday:'Thu', Friday:'Fri', Saturday:'Sat', Sunday:'Sun' };

function CourseCard({ course, onClick }) {
  return (
    <div className="course-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="course-card-accent" style={{ background: course.color }} />
      <div className="course-card-body">
        <div className="course-card-top">
          <div className="course-icon" style={{ background: course.color + '22', color: course.color }}>
            <BookOpen size={18} />
          </div>
          <div>
            <div className="course-code">{course.code}</div>
            <h3 className="course-name">{course.name}</h3>
          </div>
        </div>

        <div className="course-meta">
          <div className="course-meta-item">
            <User size={13} />
            {course.faculty}
          </div>
          <div className="course-meta-item">
            <Clock size={13} />
            {course.credits} credits
          </div>
        </div>

        <div className="course-schedule">
          {course.schedule.map((s, i) => (
            <span key={i} className="course-slot">
              {DAY_ABBR[s.day] || s.day} {s.time}
            </span>
          ))}
        </div>

        <button className="course-details-btn">
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function CourseDetailModal({ course, onClose }) {
  if (!course) return null;
  return (
    <Modal isOpen={!!course} onClose={onClose} title={course.name} size="lg">
      <div className="course-modal">
        <div className="course-modal-header" style={{ borderColor: course.color }}>
          <div className="course-modal-icon" style={{ background: course.color + '22', color: course.color }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="course-modal-code">{course.code} · {course.credits} Credits</div>
            <div className="course-modal-faculty"><User size={14} /> {course.faculty}</div>
          </div>
        </div>

        <p className="course-modal-desc">{course.description}</p>

        <h4 className="course-modal-section-title">Schedule</h4>
        <div className="course-modal-schedule">
          {course.schedule.map((s, i) => (
            <div key={i} className="course-modal-slot">
              <span className="course-slot-day">{s.day}</span>
              <span className="course-slot-time">{s.time}</span>
              <span className="course-slot-room">📍 {s.room}</span>
            </div>
          ))}
        </div>

        <h4 className="course-modal-section-title">Syllabus Overview</h4>
        <div className="course-modal-syllabus">
          {course.syllabus.map((unit, i) => (
            <div key={i} className="course-syllabus-item">
              <span className="course-syllabus-num">{i + 1}</span>
              {unit}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Courses() {
  const [selected, setSelected] = useState(null);
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="courses-page">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Semester 6 · {courses.length} courses · {totalCredits} credits</p>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => setSelected(course)}
          />
        ))}
      </div>

      <CourseDetailModal course={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default Courses;
