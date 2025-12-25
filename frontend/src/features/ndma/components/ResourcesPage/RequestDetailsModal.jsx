import PropTypes from 'prop-types';
import { X, Calendar, AlertCircle, Check, User } from 'lucide-react';

/**
 * RequestDetailsModal Component
 * Shows detailed information about a provincial request
 * Uses CSS classes from resource-allocation.css
 */
const RequestDetailsModal = ({ 
  isOpen, 
  onClose, 
  request,
  nationalStock,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const { province, items = [], requestDate, priority, reason, requestedBy } = request;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate total requested quantity
  const totalRequested = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="ndma-modal-overlay" onClick={onClose}>
      <div className="ndma-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className="ndma-modal-header">
          <div>
            <h3 className="ndma-heading-md">Request Details</h3>
            <p className="ndma-text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Review and process resource request
            </p>
          </div>
          <button className="ndma-btn-ghost" onClick={onClose} aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="ndma-modal-body request-modal-content">
          {/* Province & Status */}
          <div className="request-modal-header-info">
            <span className="request-modal-province">{province}</span>
            <span className="request-status-badge pending">Pending</span>
          </div>

          {/* Meta Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <Calendar className="w-4 h-4" style={{ color: '#64748b' }} />
              <span className="ndma-text-muted">Requested:</span>
              <span className="ndma-text-secondary">{formatDate(requestDate)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#64748b' }} />
              <span className="ndma-text-muted">Priority:</span>
              <span className={`request-priority-value ${priority}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            </div>
            {requestedBy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <User className="w-4 h-4" style={{ color: '#64748b' }} />
                <span className="ndma-text-muted">Requested by:</span>
                <span className="ndma-text-secondary">{requestedBy}</span>
              </div>
            )}
          </div>

          {/* Reason */}
          {reason && (
            <div style={{ marginBottom: '1rem' }}>
              <span className="request-items-title">Reason</span>
              <p className="ndma-text-secondary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {reason}
              </p>
            </div>
          )}

          {/* Requested Items */}
          <div className="request-items-list">
            <span className="request-items-title">Requested Items</span>
            {items.map((item, index) => (
              <div key={index} className="request-item-detail">
                <span className="request-item-detail-name">{item.name}</span>
                <div className="request-item-detail-qty">
                  <span className="request-item-qty-requested">
                    {item.quantity.toLocaleString()} {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stock Comparison */}
          <div className="stock-comparison-section" style={{ marginTop: '1rem' }}>
            <div className="stock-comparison-card">
              <span className="stock-comparison-label">Total Requested</span>
              <span className="stock-comparison-value requested">
                {totalRequested.toLocaleString()}
              </span>
            </div>
            <div className="stock-comparison-card">
              <span className="stock-comparison-label">Available Stock</span>
              <span className={`stock-comparison-value ${nationalStock?.totalAvailable >= totalRequested ? 'remaining' : 'insufficient'}`}>
                {(nationalStock?.totalAvailable || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ndma-modal-footer request-modal-actions">
          <button 
            className="request-btn request-btn-approve"
            onClick={() => onApprove(request)}
          >
            <Check className="w-4 h-4" />
            Approve Request
          </button>
          <button 
            className="request-btn request-btn-reject"
            onClick={() => onReject(request)}
          >
            <X className="w-4 h-4" />
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
};

RequestDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  request: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    province: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      quantity: PropTypes.number,
      unit: PropTypes.string,
    })),
    requestDate: PropTypes.string,
    priority: PropTypes.string,
    reason: PropTypes.string,
    requestedBy: PropTypes.string,
  }),
  nationalStock: PropTypes.shape({
    totalAvailable: PropTypes.number,
  }),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default RequestDetailsModal;
