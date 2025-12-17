import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">{getIcon()}</div>
      <div className="toast__message">{message}</div>
      <button
        className="toast__close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
