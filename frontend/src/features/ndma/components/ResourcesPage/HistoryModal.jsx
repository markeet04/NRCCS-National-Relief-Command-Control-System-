import PropTypes from 'prop-types';
import { X, Clock, MapPin } from 'lucide-react';

/**
 * HistoryModal Component
 * Shows history of resources sent to a specific province
 * Improved dark theme styling with proper CSS classes
 */
const HistoryModal = ({ isOpen, onClose, province, history = [] }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="resource-history-overlay" onClick={onClose}>
      <div className="resource-history-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="resource-history-header">
          <div className="resource-history-header-left">
            <div className="resource-history-icon-wrapper">
              <MapPin className="resource-history-icon" />
            </div>
            <div className="resource-history-header-text">
              <h3 className="resource-history-title">{province} Allocation History</h3>
              <p className="resource-history-subtitle">
                {history.length} allocation{history.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
          <button 
            className="resource-history-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="resource-history-body">
          {history && history.length > 0 ? (
            <div className="history-timeline">
              {history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-item-dot">
                    <div className="history-item-dot-inner" />
                  </div>
                  <div className="history-item-content">
                    <div className="history-item-header">
                      <span className="history-item-date">{formatDate(entry.date)}</span>
                      <span className={`history-item-status ${entry.status}`}>
                        {entry.status}
                      </span>
                    </div>
                    <div className="history-item-details">
                      {entry.items?.map((item, idx) => (
                        <div key={idx} className="history-item-row">
                          <span className="history-item-label">{item.name}</span>
                          <span className="history-item-value">
                            {item.quantity?.toLocaleString()} {item.unit || 'units'}
                          </span>
                        </div>
                      ))}
                      {entry.approvedBy && (
                        <div className="history-item-row history-item-approved-by">
                          <span className="history-item-label">Approved by</span>
                          <span className="history-item-value">{entry.approvedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="resource-history-empty">
              <Clock className="resource-history-empty-icon" />
              <p className="resource-history-empty-text">No allocation history</p>
              <p className="resource-history-empty-subtext">
                No resources have been allocated to {province} yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="resource-history-footer">
          <button 
            className="resource-history-close-footer-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

HistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  province: PropTypes.string,
  history: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        quantity: PropTypes.number,
        unit: PropTypes.string,
      })),
      status: PropTypes.string,
      approvedBy: PropTypes.string,
    })
  ),
};

export default HistoryModal;
