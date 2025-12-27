import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ApproveModal = ({ isOpen, onClose, onConfirm, suggestion }) => {
  if (!isOpen || !suggestion) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-lg max-w-md w-full p-6" style={{ backgroundColor: 'var(--surface)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success-bg)' }}>
              <CheckCircle size={20} style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Approve Suggestion
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Confirm resource allocation
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Province:</span>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {suggestion.provinceName}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Resource:</span>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {suggestion.resourceType}
                </p>
              </div>
              <div className="col-span-2">
                <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                <p className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                  {suggestion.suggestedQuantity.toLocaleString()} units
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'var(--warning-bg)' }}>
            <AlertCircle size={16} style={{ color: 'var(--warning)', marginTop: '2px' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              This will immediately allocate resources from NDMA national stock to the selected province (PDMA).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
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
  );
};

export default ApproveModal;
