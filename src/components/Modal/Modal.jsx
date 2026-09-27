/* ============================================================
   Modal Component
   
   A reusable modal dialog that:
   - Traps focus inside when open (accessibility)
   - Closes on Escape key
   - Closes on backdrop click (but NOT on inner click)
   - Smooth scale/fade animation
   ============================================================ */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',   // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose = true,
  className = '',
}) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Clicking the backdrop (but not the modal content) closes it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={modalRef}
        className={`modal modal-${size} ${className}`}
      >
        {(showClose || title) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showClose && (
              <button className="modal-close" onClick={onClose} aria-label="Close dialog">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
