import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ApproveModal = ({ isOpen, onClose, onConfirm, suggestion }) => {
  if (!isOpen || !suggestion) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      <div className="approve-modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="approve-modal" style={{ backgroundColor: 'var(--surface)' }}>
          {/* Header */}
          <div className="approve-modal-header">
            <div className="approve-modal-header-left">
              <div className="approve-modal-icon" style={{ backgroundColor: 'var(--success-bg)' }}>
                <CheckCircle size={20} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <h3 className="approve-modal-title" style={{ color: 'var(--text-primary)' }}>
                  Approve Suggestion
                </h3>
                <p className="approve-modal-subtitle" style={{ color: 'var(--text-muted)' }}>
                  Confirm resource allocation
                </p>
              </div>
            </div>
            <button onClick={onClose} className="approve-modal-close" style={{ color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="approve-modal-content">
            <div className="approve-modal-info" style={{ backgroundColor: 'var(--surface-elevated)' }}>
              <div className="approve-modal-grid">
                <div>
                  <span className="approve-modal-label" style={{ color: 'var(--text-muted)' }}>Province:</span>
                  <p className="approve-modal-value" style={{ color: 'var(--text-primary)' }}>
                    {suggestion.provinceName}
                  </p>
                </div>
                <div>
                  <span className="approve-modal-label" style={{ color: 'var(--text-muted)' }}>Resource:</span>
                  <p className="approve-modal-value" style={{ color: 'var(--text-primary)' }}>
                    {suggestion.resourceType}
                  </p>
                </div>
                <div className="approve-modal-quantity-section">
                  <span className="approve-modal-label" style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                  <p className="approve-modal-quantity" style={{ color: 'var(--success)' }}>
                    {suggestion.suggestedQuantity.toLocaleString()} units
                  </p>
                </div>
              </div>
            </div>

            <div className="approve-modal-warning" style={{ backgroundColor: 'var(--warning-bg)' }}>
              <AlertCircle size={16} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                This will immediately allocate resources from NDMA national stock to the selected province (PDMA).
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="approve-modal-actions">
            <button
              onClick={onClose}
              className="approve-modal-btn approve-modal-btn--cancel"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-primary)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="approve-modal-btn approve-modal-btn--confirm"
              style={{
                backgroundColor: 'var(--success)',
                color: 'white',
              }}
            >
              Approve & Allocate
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .approve-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .approve-modal {
          border-radius: 0.5rem;
          max-width: 28rem;
          width: 100%;
          padding: 1.5rem;
        }

        .approve-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .approve-modal-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .approve-modal-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .approve-modal-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .approve-modal-subtitle {
          font-size: 0.875rem;
        }

        .approve-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
        }

        .approve-modal-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .approve-modal-info {
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .approve-modal-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .approve-modal-label {
          font-size: 0.875rem;
        }

        .approve-modal-value {
          font-weight: 500;
        }

        .approve-modal-quantity-section {
          grid-column: span 2;
        }

        .approve-modal-quantity {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .approve-modal-warning {
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .approve-modal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .approve-modal-btn {
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
          .approve-modal {
            padding: 1.25rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .approve-modal-overlay {
            padding: 0.75rem;
            align-items: flex-end;
          }

          .approve-modal {
            padding: 1rem;
            border-radius: 0.75rem 0.75rem 0 0;
            max-width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .approve-modal-icon {
            width: 2.25rem;
            height: 2.25rem;
          }

          .approve-modal-title {
            font-size: 1rem;
          }

          .approve-modal-subtitle {
            font-size: 0.8125rem;
          }

          .approve-modal-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .approve-modal-quantity-section {
            grid-column: span 1;
          }

          .approve-modal-quantity {
            font-size: 1.125rem;
          }

          .approve-modal-warning {
            font-size: 0.8125rem;
          }

          .approve-modal-actions {
            flex-direction: column-reverse;
          }

          .approve-modal-btn {
            padding: 0.75rem 1rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .approve-modal-header-left {
            gap: 0.5rem;
          }

          .approve-modal-icon {
            width: 2rem;
            height: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default ApproveModal;
