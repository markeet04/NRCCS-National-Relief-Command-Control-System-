/**
 * Modal Component
 * Reusable modal wrapper with backdrop and close functionality
 */

import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  colors,
  isLight = false,
  maxWidth = '600px'
}) => {
  if (!isOpen) return null;

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    background: colors?.modalBg || colors?.cardBg || (isLight ? '#ffffff' : '#1f2937'),
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: maxWidth,
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    border: `1px solid ${colors?.border || (isLight ? '#e5e7eb' : '#374151')}`,
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: colors?.textPrimary || (isLight ? '#111827' : '#f9fafb'),
    marginBottom: '24px'
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>
          <X style={{ 
            color: colors?.textMuted || (isLight ? '#9ca3af' : '#6b7280'), 
            width: '24px', 
            height: '24px' 
          }} />
        </button>
        
        {title && <h2 style={titleStyle}>{title}</h2>}
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
