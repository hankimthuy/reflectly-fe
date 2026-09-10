import React, { useEffect } from 'react';
import './Snackbar.scss';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  open: boolean;
  message: string;
  title?: string;
  type: SnackbarType;
  onClose: () => void;
  autoHideDuration?: number;
}

/** A flat, bordered notice — see mockup 3c's rate-limit card for the reference look (dark chip,
 * accent dot, message). Fixed bottom-right rather than inline like that mockup, since this one
 * has to work from any page, not just the one screen that mocked it. */
const SnackbarComponent: React.FC<SnackbarProps> = ({ open, message, title, type, onClose, autoHideDuration }) => {
  useEffect(() => {
    if (!open || !autoHideDuration) return undefined;
    const timer = setTimeout(onClose, autoHideDuration);
    return () => clearTimeout(timer);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div className={`snackbar snackbar--${type}`} role="status">
      <span className="snackbar__dot" />
      <div className="snackbar-content">
        {title && <span className="snackbar-title">{title}</span>}
        <span className="snackbar-message">{message}</span>
      </div>
      <button type="button" className="snackbar__close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
};

export default SnackbarComponent;
