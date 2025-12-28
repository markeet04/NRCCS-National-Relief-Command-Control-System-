import React, { useState } from 'react';
import { XCircle, X } from 'lucide-react';

const RejectModal = ({ isOpen, onClose, onConfirm, suggestion }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !suggestion) return null;

  const handleConfirm = () => {
    if (reason.trim().length < 10) {
      setError('Please provide a reason (minimum 10 characters)');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <>
      <div className="reject-modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="reject-modal" style={{ backgroundColor: 'var(--surface)' }}>
          {/* Header */}
          <div className="reject-modal-header">
            <div className="reject-modal-header-left">
              <div className="reject-modal-icon" style={{ backgroundColor: 'var(--error-bg)' }}>
                <XCircle size={20} style={{ color: 'var(--error)' }} />
              </div>
              <div>
                <h3 className="reject-modal-title" style={{ color: 'var(--text-primary)' }}>
                  Reject Suggestion
                </h3>
                <p className="reject-modal-subtitle" style={{ color: 'var(--text-muted)' }}>
                  Provide a reason for rejection
                </p>
              </div>
            </div>
            <button onClick={handleClose} className="reject-modal-close" style={{ color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="reject-modal-content">
            <div className="reject-modal-info" style={{ backgroundColor: 'var(--surface-elevated)' }}>
              <div className="reject-modal-info-row" style={{ color: 'var(--text-muted)' }}>
                Province: <span style={{ color: 'var(--text-primary)' }}>{suggestion.provinceName}</span>
              </div>
              <div className="reject-modal-info-row" style={{ color: 'var(--text-muted)' }}>
                Resource: <span style={{ color: 'var(--text-primary)' }}>{suggestion.resourceType}</span> 
                {' '}({suggestion.suggestedQuantity.toLocaleString()} units)
              </div>
            </div>

            <div className="reject-modal-textarea-container">
              <label className="reject-modal-label" style={{ color: 'var(--text-primary)' }}>
                Reason for Rejection *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                placeholder="Explain why this suggestion is being rejected (min. 10 characters)..."
                rows={4}
                className="reject-modal-textarea"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: error ? 'var(--error)' : 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
              {error && (
                <p className="reject-modal-error" style={{ color: 'var(--error)' }}>
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="reject-modal-actions">
            <button
              onClick={handleClose}
              className="reject-modal-btn reject-modal-btn--cancel"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="reject-modal-btn reject-modal-btn--confirm"
              style={{
                backgroundColor: 'var(--error)',
                color: 'white',
              }}
            >
              Reject Suggestion
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .reject-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .reject-modal {
          border-radius: 0.5rem;
          max-width: 28rem;
          width: 100%;
          padding: 1.5rem;
        }

        .reject-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .reject-modal-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .reject-modal-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reject-modal-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .reject-modal-subtitle {
          font-size: 0.875rem;
        }

        .reject-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
        }

        .reject-modal-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .reject-modal-info {
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .reject-modal-info-row {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .reject-modal-info-row:last-child {
          margin-bottom: 0;
        }

        .reject-modal-textarea-container {
          width: 100%;
        }

        .reject-modal-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .reject-modal-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border-width: 1px;
          border-style: solid;
          resize: none;
          font-family: inherit;
          font-size: 0.875rem;
        }

        .reject-modal-textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .reject-modal-error {
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .reject-modal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .reject-modal-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .reject-modal {
            padding: 1.25rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .reject-modal-overlay {
            padding: 0.75rem;
            align-items: flex-end;
          }

          .reject-modal {
            padding: 1rem;
            border-radius: 0.75rem 0.75rem 0 0;
            max-width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .reject-modal-icon {
            width: 2.25rem;
            height: 2.25rem;
          }

          .reject-modal-title {
            font-size: 1rem;
          }

          .reject-modal-subtitle {
            font-size: 0.8125rem;
          }

          .reject-modal-info-row {
            font-size: 0.8125rem;
          }

          .reject-modal-actions {
            flex-direction: column-reverse;
          }

          .reject-modal-btn {
            padding: 0.75rem 1rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .reject-modal-header-left {
            gap: 0.5rem;
          }

          .reject-modal-icon {
            width: 2rem;
            height: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default RejectModal;
