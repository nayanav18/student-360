/* ============================================================
   MyPlan — Personal task planner
   
   Features:
   - Quick add tasks (batch entry mode)
   - Date/time autofill with today's date
   - Delete with confirmation dialog
   - Tasks appear in Academic Calendar
   - Priority selection
   - Complete/uncomplete tasks
   ============================================================ */

import { useState } from 'react';
import {
  Plus, CheckCircle2, Circle, Trash2, Calendar,
  Clock, Flag, ChevronDown, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './MyPlan.css';

const TODAY = '2026-09-28';
const DEFAULT_TIME = '09:00 AM';

const PRIORITIES = [
  { value: 'high',   label: 'High',   color: 'var(--danger)' },
  { value: 'medium', label: 'Medium', color: 'var(--warning)' },
  { value: 'low',    label: 'Low',    color: 'var(--success)' },
];

/* New task form — one entry at a time */
function AddTaskForm({ onAdd }) {
  const [title, setTitle]       = useState('');
  const [date, setDate]         = useState(TODAY);    // auto-filled today
  const [time, setTime]         = useState('09:00');  // sensible default
  const [priority, setPriority] = useState('medium');
  const [error, setError]       = useState('');

  const handleAdd = () => {
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    // Format time from 24h input to 12h display
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    const formattedTime = `${h12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${ampm}`;

    onAdd({ title: title.trim(), date, time: formattedTime, priority });
    setTitle('');
    setDate(TODAY);
    setTime('09:00');
    setPriority('medium');
    setError('');
  };

  return (
    <div className="add-task-form">
      <div className="add-task-inputs">
        <input
          type="text"
          className="add-task-input"
          placeholder="What do you need to do?"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          autoFocus
        />

        <div className="add-task-meta">
          {/* Date — auto-filled to today */}
          <div className="add-task-field">
            <Calendar size={14} />
            <input
              type="date"
              className="add-task-meta-input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* Time — sensible default */}
          <div className="add-task-field">
            <Clock size={14} />
            <input
              type="time"
              className="add-task-meta-input"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="add-task-field">
            <Flag size={14} />
            <select
              className="add-task-meta-input"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITIES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="add-task-error">{error}</div>}
      </div>

      <button className="add-task-btn" onClick={handleAdd}>
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
}

/* Delete confirmation dialog */
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="delete-confirm">
      <div className="delete-confirm-content">
        <Trash2 size={20} className="delete-confirm-icon" />
        <div>
          <div className="delete-confirm-title">Delete this task?</div>
          <div className="delete-confirm-sub">This task will be permanently removed.</div>
        </div>
      </div>
      <div className="delete-confirm-actions">
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}

/* Individual task item */
function TaskItem({ task, onToggle, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { showToast } = useApp();

  const p = PRIORITIES.find(p => p.value === task.priority) || PRIORITIES[1];

  const handleDelete = () => {
    onDelete(task.id);
    showToast('Task deleted', 'success');
  };

  return (
    <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      {/* Toggle complete */}
      <button
        className="task-toggle"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed
          ? <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          : <Circle size={20} style={{ color: 'var(--text-tertiary)' }} />
        }
      </button>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className="task-meta-item">
            <Calendar size={11} /> {task.date}
          </span>
          <span className="task-meta-item">
            <Clock size={11} /> {task.time}
          </span>
          <span className="task-priority-dot" style={{ background: p.color }} title={p.label} />
        </div>
      </div>

      {/* Delete button */}
      <button
        className="task-delete-btn"
        onClick={() => setConfirmDelete(true)}
        aria-label="Delete task"
      >
        <Trash2 size={15} />
      </button>

      {/* Inline delete confirmation */}
      {confirmDelete && (
        <div className="task-confirm-overlay">
          <DeleteConfirm
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
          />
        </div>
      )}
    </div>
  );
}

/* ---- Main Page ---- */
function MyPlan() {
  const { tasks, addTask, updateTask, deleteTask, showToast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterDate, setFilterDate]  = useState('all');

  const handleAdd = (taskData) => {
    addTask(taskData);
    showToast('Task added successfully', 'success');
    // Keep form open for batch entry
  };

  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    updateTask(id, { completed: !task.completed });
  };

  // Group tasks by date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.date) - new Date(b.date);
  });

  const pending   = sortedTasks.filter(t => !t.completed);
  const completed = sortedTasks.filter(t => t.completed);

  return (
    <div className="myplan-page">
      <div className="myplan-header">
        <div>
          <h1 className="page-title">My Plan</h1>
          <p className="page-subtitle">
            {pending.length} pending · {completed.length} completed
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(s => !s)}
        >
          <Plus size={16} />
          {showAddForm ? 'Close' : 'Add Task'}
        </button>
      </div>

      {/* Add task form (expanded) */}
      {showAddForm && (
        <div className="myplan-add-section">
          <div className="myplan-add-header">
            <h3>New Task</h3>
            <p className="myplan-add-hint">Date and time are pre-filled to today. Press Enter or click Add Task. Add more tasks without closing.</p>
          </div>
          <AddTaskForm onAdd={handleAdd} />
        </div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="myplan-empty">
          <div className="myplan-empty-icon">📋</div>
          <h3>No tasks yet</h3>
          <p>Start planning your day by adding your first task.</p>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={16} /> Add your first task
          </button>
        </div>
      )}

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="task-group">
          <div className="task-group-label">
            Pending <span>{pending.length}</span>
          </div>
          <div className="task-list">
            {pending.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed tasks */}
      {completed.length > 0 && (
        <div className="task-group">
          <div className="task-group-label task-group-done">
            Completed <span>{completed.length}</span>
          </div>
          <div className="task-list">
            {completed.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlan;
