/* ============================================================
   Toast Notification System
   
   Toasts are temporary messages that appear after actions.
   They appear in the corner of the screen, then disappear.
   
   ARCHITECTURE:
   - ToastContainer: fixed positioned wrapper, renders all toasts
   - ToastItem: individual toast with auto-dismiss and animation
   
   The toasts array lives in AppContext so any component can
   trigger a toast with: showToast("Message", "success")
   ============================================================ */

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

/* Individual toast item */
function ToastItem({ id, message, type, duration }) {
  const { removeToast } = useApp();
  // Controls the exit animation
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Start exit animation just before the toast is removed
    const exitTimer = setTimeout(() => setLeaving(true), duration - 400);
    return () => clearTimeout(exitTimer);
  }, [duration]);

  const icons = {
    success: <CheckCircle size={16} />,
    error:   <AlertCircle size={16} />,
    warning: <AlertTriangle size={16} />,
    info:    <Info size={16} />,
  };

  return (
    <div
      className={`toast toast-${type} ${leaving ? 'toast-leaving' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon">{icons[type] || icons.info}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => { setLeaving(true); setTimeout(() => removeToast(id), 400); }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* Container that renders all toasts */
export function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
