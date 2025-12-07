import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * DemoModal Component
 * Displays a demo notification for button interactions
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.type - Type of message (success, info, warning)
 */
const DemoModal = ({ isOpen, onClose, title = 'Demo Action', message = 'This is a demo feature', type = 'info' }) => {
  if (!isOpen) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)'
  };

  const textColors = {
    success: '#10b981',
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  const borderColors = {
    success: '#10b981',
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            border: `2px solid ${borderColors[type]}`,
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: textColors[type], margin: 0 }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{
              background: bgColors[type],
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
              borderLeft: `4px solid ${borderColors[type]}`
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: textColors[type],
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
};

DemoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error'])
};

export default DemoModal;
