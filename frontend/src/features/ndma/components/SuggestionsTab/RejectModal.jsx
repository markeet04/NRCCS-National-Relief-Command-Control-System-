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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-lg max-w-md w-full p-6" style={{ backgroundColor: 'var(--surface)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--error-bg)' }}>
              <XCircle size={20} style={{ color: 'var(--error)' }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Reject Suggestion
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Provide a reason for rejection
              </p>
            </div>
          </div>
          <button onClick={handleClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              Province: <span style={{ color: 'var(--text-primary)' }}>{suggestion.provinceName}</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Resource: <span style={{ color: 'var(--text-primary)' }}>{suggestion.resourceType}</span> 
              {' '}({suggestion.suggestedQuantity.toLocaleString()} units)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
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
              className="w-full px-3 py-2 rounded-lg border resize-none"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: error ? 'var(--error)' : 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
            {error && (
              <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
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
              backgroundColor: 'var(--error)',
              color: 'white',
            }}
          >
            Reject Suggestion
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
