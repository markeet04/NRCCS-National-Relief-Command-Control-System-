/**
 * Modal Component
 * Reusable modal wrapper with backdrop and close functionality
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import { X } from 'lucide-react';
import '@styles/css/main.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
  size = 'md' // 'sm', 'md', 'lg', 'xl'
}) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'modal--sm',
    md: 'modal--md',
    lg: 'modal--lg',
    xl: 'modal--xl'
  }[size] || 'modal--md';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${sizeClass}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button onClick={onClose} className="modal__close">
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

