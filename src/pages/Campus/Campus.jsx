/* ============================================================
   Campus Page — Discover events, workshops, competitions
   
   Features:
   - Category filter tabs (All, Events, Competitions, Workshops, Announcements)
   - Rich image cards
   - Event detail modal with same image as card
   - Registration flow with contextual questions
   - Automatic calendar entry after registration
   ============================================================ */

import { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, Users, User, BookmarkPlus, Bookmark } from 'lucide-react';
import { campusEvents, announcements } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal/Modal';
import './Campus.css';

const CATEGORIES = ['All', 'Event', 'Workshop', 'Competition', 'Announcement'];

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ---- Event Card ---- */
function EventCard({ event, onOpen, isRegistered }) {
  return (
    <div className="event-card" onClick={() => onOpen(event)} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(event)}>
      {/* Large image */}
      <div className="event-card-img-wrap">
        <img src={event.image} alt={event.title} className="event-card-img" loading="lazy" />
        <div className="event-card-img-overlay" />
        <span className="event-card-category">{event.category}</span>
        {isRegistered && (
          <span className="event-card-registered">
            <CheckCircle size={12} /> Registered
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.shortDescription}</p>

        <div className="event-card-meta">
          <span><Calendar size={12} />{formatDate(event.date)}</span>
          <span><MapPin size={12} />{event.location.split(',')[0]}</span>
        </div>

        {event.registrationDeadline && (
          <div className="event-card-deadline">
            Registration closes {formatDate(event.registrationDeadline)}
          </div>
        )}

        {event.tags && (
          <div className="event-card-tags">
            {event.tags.slice(0, 3).map(t => (
              <span key={t} className="event-tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Event Detail Modal ---- */
function EventDetailModal({ event, onClose, onRegister, isRegistered }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showRegFlow, setShowRegFlow] = useState(false);
  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={onClose} size="xl" showClose>
      <div className="event-detail">
        {/* SAME IMAGE as the card — requirement met */}
        <img src={event.image} alt={event.title} className="event-detail-img" />

        <div className="event-detail-body">
          <div className="event-detail-header">
            <div>
              <span className="badge badge-accent">{event.category}</span>
              <h2 className="event-detail-title">{event.title}</h2>
            </div>
            <button
              className={`event-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
              onClick={() => setBookmarked(b => !b)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
            >
              {bookmarked ? <Bookmark size={20} /> : <BookmarkPlus size={20} />}
            </button>
          </div>

          {/* Meta info grid */}
          <div className="event-detail-meta-grid">
            <div className="event-meta-item">
              <Calendar size={15} />
              <div>
                <div className="event-meta-label">Date</div>
                <div className="event-meta-value">{formatDate(event.date)}{event.endDate !== event.date ? ` – ${formatDate(event.endDate)}` : ''}</div>
              </div>
            </div>
            <div className="event-meta-item">
              <Clock size={15} />
              <div>
                <div className="event-meta-label">Time</div>
                <div className="event-meta-value">{event.time}</div>
              </div>
            </div>
            <div className="event-meta-item">
              <MapPin size={15} />
              <div>
                <div className="event-meta-label">Location</div>
                <div className="event-meta-value">{event.location}</div>
              </div>
            </div>
            {event.registrationDeadline && (
              <div className="event-meta-item">
                <Calendar size={15} />
                <div>
                  <div className="event-meta-label">Register by</div>
                  <div className="event-meta-value" style={{ color: 'var(--danger)' }}>{formatDate(event.registrationDeadline)}</div>
                </div>
              </div>
            )}
          </div>

          <p className="event-detail-desc">{event.description}</p>

          {/* Tags */}
          <div className="event-card-tags" style={{ marginTop: 0 }}>
            {event.tags?.map(t => <span key={t} className="event-tag">{t}</span>)}
          </div>

          {/* Registration action */}
          <div className="event-detail-actions">
            {isRegistered ? (
              <div className="event-registered-badge">
                <CheckCircle size={18} />
                You're registered for this event!
              </div>
            ) : showRegFlow ? (
              <RegistrationFlow event={event} onComplete={(data) => { onRegister(event, data); setShowRegFlow(false); }} onCancel={() => setShowRegFlow(false)} />
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => setShowRegFlow(true)}>
                Register for this Event
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---- Registration Flow ---- */
function RegistrationFlow({ event, onComplete, onCancel }) {
  const [regType, setRegType]     = useState('');
  const [teamSize, setTeamSize]   = useState('solo');
  const [teamName, setTeamName]   = useState('');

  const options = event.registrationOptions || ['Participation'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ type: regType, teamSize, teamName });
  };

  return (
    <form onSubmit={handleSubmit} className="reg-flow">
      <h4 className="reg-flow-title">Register for {event.title}</h4>

      {/* Registration type */}
      <div className="reg-section">
        <label className="reg-label">How would you like to participate?</label>
        <div className="reg-options">
          {options.map(opt => (
            <label key={opt} className={`reg-option ${regType === opt ? 'reg-option-selected' : ''}`}>
              <input
                type="radio"
                name="regType"
                value={opt}
                checked={regType === opt}
                onChange={e => setRegType(e.target.value)}
                required
              />
              {opt === 'Participation' ? <Users size={15} /> : <User size={15} />}
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* If participation, show solo/group */}
      {regType === 'Participation' && (
        <div className="reg-section">
          <label className="reg-label">Participation type</label>
          <div className="reg-options">
            {['Solo', 'Group'].map(t => (
              <label key={t} className={`reg-option ${teamSize === t.toLowerCase() ? 'reg-option-selected' : ''}`}>
                <input type="radio" name="teamSize" value={t.toLowerCase()}
                  checked={teamSize === t.toLowerCase()} onChange={e => setTeamSize(e.target.value)} />
                {t === 'Solo' ? <User size={15} /> : <Users size={15} />}
                {t}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Group name if group */}
      {teamSize === 'group' && regType === 'Participation' && (
        <div className="reg-section">
          <label className="reg-label">Team Name</label>
          <input
            type="text"
            className="reg-input"
            placeholder="Enter your team name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="reg-actions">
        <button type="submit" className="btn btn-primary" disabled={!regType}>
          Confirm Registration
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ---- Main Campus Page ---- */
function Campus() {
  const { isRegistered, registerForEvent, showToast } = useApp();
  const [category, setCategory] = useState('All');
  const [openEvent, setOpenEvent] = useState(null);

  const filtered = category === 'All' || category === 'Announcement'
    ? campusEvents.filter(e =>
        category === 'All' ? true : e.category === category
      )
    : campusEvents.filter(e => e.category === category);

  const handleRegister = (event, data) => {
    registerForEvent(event.id, { ...data, eventTitle: event.title });
    showToast(`Registered for ${event.title}!`, 'success');
    setOpenEvent(null);
  };

  return (
    <div className="campus-page">
      <div>
        <h1 className="page-title">Campus</h1>
        <p className="page-subtitle">Discover events, workshops, and competitions happening on campus</p>
      </div>

      {/* Category filter */}
      <div className="campus-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`campus-filter-btn ${category === cat ? 'campus-filter-active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
            {cat !== 'Announcement' && (
              <span className="campus-filter-count">
                {cat === 'All' ? campusEvents.length : campusEvents.filter(e => e.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Announcements section */}
      {(category === 'All' || category === 'Announcement') && (
        <div className="campus-announcements">
          <div className="section-label">Announcements</div>
          {announcements.map(a => (
            <div key={a.id} className={`announcement-item ${a.isRead ? '' : 'announcement-unread'}`}>
              <div className="announcement-dot" />
              <div>
                <div className="announcement-title">{a.title}</div>
                <div className="announcement-body">{a.body}</div>
                <div className="announcement-date">{formatDate(a.date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events grid */}
      {category !== 'Announcement' && (
        <div className="events-grid">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={setOpenEvent}
              isRegistered={isRegistered(event.id)}
            />
          ))}
        </div>
      )}

      {/* Event detail modal */}
      <EventDetailModal
        event={openEvent}
        onClose={() => setOpenEvent(null)}
        onRegister={handleRegister}
        isRegistered={openEvent ? isRegistered(openEvent.id) : false}
      />
    </div>
  );
}

export default Campus;
