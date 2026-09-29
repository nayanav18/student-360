/* ============================================================
   App Context — Global state that needs to be shared across
   many components without "prop drilling".
   
   WHY CONTEXT?
   Without context, you'd have to pass props like:
   App → Layout → Sidebar → NavItem (just to know the theme!)
   
   With context, any component can read/update global state
   directly using useContext(AppContext).
   
   WHAT'S STORED HERE:
   - theme (light/dark)
   - tasks (personal planner tasks)
   - notes
   - registeredEvents
   - toast notifications queue
   ============================================================ */

import { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create the context object
const AppContext = createContext(null);

// Provider component — wraps the entire app
export function AppProvider({ children }) {
  // ---- Theme ----
  const [theme, setTheme] = useLocalStorage('s360-theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  // Apply theme to <body> element via data-theme attribute
  // Our CSS uses [data-theme="dark"] { ... } selectors
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', theme);
  }

  // ---- Personal Tasks (My Plan) ----
  const [tasks, setTasks] = useLocalStorage('s360-tasks', [
    {
      id: 'T001',
      title: 'Review ML lecture notes',
      date: '2026-09-28',
      time: '04:00 PM',
      completed: false,
      priority: 'high',
    },
    {
      id: 'T002',
      title: 'Start DBMS ER diagram assignment',
      date: '2026-09-29',
      time: '10:00 AM',
      completed: false,
      priority: 'high',
    },
    {
      id: 'T003',
      title: 'Read AI textbook Chapter 4',
      date: '2026-09-30',
      time: '06:00 PM',
      completed: false,
      priority: 'medium',
    },
  ]);

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: 'T' + Date.now(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, [setTasks]);

  // ---- Notes ----
  const [notes, setNotes] = useLocalStorage('s360-notes', [
    {
      id: 'N001',
      title: 'Machine Learning — Lecture Notes',
      content: '<h2>Supervised Learning</h2><p>Supervised learning uses labeled training data to learn a mapping from inputs to outputs...</p><ul><li>Classification</li><li>Regression</li></ul>',
      updatedAt: '2026-09-25T14:30:00',
      tags: ['ML', 'Study'],
    },
    {
      id: 'N002',
      title: 'DBMS — Normalization Summary',
      content: '<h2>Normal Forms</h2><p>Database normalization reduces redundancy and improves data integrity...</p><ol><li>1NF: Atomic values</li><li>2NF: No partial dependencies</li><li>3NF: No transitive dependencies</li><li>BCNF: Stricter 3NF</li></ol>',
      updatedAt: '2026-09-23T09:00:00',
      tags: ['DBMS', 'Study'],
    },
  ]);

  const addNote = useCallback((note) => {
    const newNote = {
      ...note,
      id: 'N' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, [setNotes]);

  const updateNote = useCallback((id, updates) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ));
  }, [setNotes]);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, [setNotes]);

  // ---- Custom Calendar Events ----
  const [customEvents, setCustomEvents] = useLocalStorage('s360-calendar-events', []);

  const addCustomEvent = useCallback((event) => {
    const newEvent = {
      ...event,
      id: 'CE-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCustomEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, [setCustomEvents]);

  const deleteCustomEvent = useCallback((id) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  }, [setCustomEvents]);

  // ---- Assignment Submissions (Local File Uploads) ----
  const [assignmentSubmissions, setAssignmentSubmissions] = useLocalStorage('s360-assignment-submissions', {});

  const submitAssignment = useCallback((assignmentId, submissionData) => {
    setAssignmentSubmissions(prev => ({
      ...prev,
      [assignmentId]: {
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'completed',
      },
    }));
  }, [setAssignmentSubmissions]);

  const removeAssignmentSubmission = useCallback((assignmentId) => {
    setAssignmentSubmissions(prev => {
      const copy = { ...prev };
      delete copy[assignmentId];
      return copy;
    });
  }, [setAssignmentSubmissions]);

  // ---- Event Registrations ----
  const [registrations, setRegistrations] = useLocalStorage('s360-registrations', {});

  const registerForEvent = useCallback((eventId, registrationData) => {
    setRegistrations(prev => ({
      ...prev,
      [eventId]: { ...registrationData, registeredAt: new Date().toISOString() },
    }));
  }, [setRegistrations]);

  const isRegistered = useCallback((eventId) => {
    return !!registrations[eventId];
  }, [registrations]);

  // ---- Toast Notifications ----
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    setToasts(prev => [...prev, { id, message, type, duration }]);
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 400); // extra time for exit animation
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ---- The context value exposed to all components ----
  const value = {
    // Theme
    theme,
    toggleTheme,

    // Tasks
    tasks,
    addTask,
    updateTask,
    deleteTask,

    // Notes
    notes,
    addNote,
    updateNote,
    deleteNote,

    // Custom Calendar Events
    customEvents,
    addCustomEvent,
    deleteCustomEvent,

    // Assignment Submissions
    assignmentSubmissions,
    submitAssignment,
    removeAssignmentSubmission,

    // Events
    registrations,
    registerForEvent,
    isRegistered,

    // Toasts
    toasts,
    showToast,
    removeToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context — simpler than importing both
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export default AppContext;
