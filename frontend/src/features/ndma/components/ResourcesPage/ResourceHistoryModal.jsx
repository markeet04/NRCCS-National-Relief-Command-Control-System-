import PropTypes from 'prop-types';
import { X, Clock, Package, Stethoscope, Home, Droplets, MapPin } from 'lucide-react';

/**
 * Resource icon mapping
 */
const RESOURCE_ICONS = {
  food: Package,
  medical: Stethoscope,
  shelter: Home,
  water: Droplets,
  'Food Supplies': Package,
  'Medical Kits': Stethoscope,
  'Shelter Tents': Home,
  'Water': Droplets,
  'Blankets': Home,
  'Emergency Medicine': Stethoscope,
};

/**
 * ResourceHistoryModal Component
 * Enhanced modal showing timeline/history of resource allocations
 * Styled to match the provincial HistoryModal with timeline view
 */
const ResourceHistoryModal = ({ 
  isOpen, 
  onClose, 
  resourceType,
  resourceLabel,
  history = [] 
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const Icon = RESOURCE_ICONS[resourceType] || Package;

  return (
    <div className="resource-history-overlay" onClick={onClose}>
      <div className="resource-history-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="resource-history-header">
          <div className="resource-history-header-left">
            <div className="resource-history-icon-wrapper">
              <Icon className="resource-history-icon" />
            </div>
            <div className="resource-history-header-text">
              <h3 className="resource-history-title">{resourceLabel || resourceType} History</h3>
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

        {/* Body - Timeline View */}
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
                      <span className="history-item-status delivered">delivered</span>
                    </div>
                    <div className="history-item-details">
                      <div className="history-item-row">
                        <span className="history-item-label">
                          <MapPin className="w-3.5 h-3.5" style={{ display: 'inline', marginRight: '4px' }} />
                          Province
                        </span>
                        <span className="history-item-value">{entry.province}</span>
                      </div>
                      <div className="history-item-row">
                        <span className="history-item-label">Amount Allocated</span>
                        <span className="history-item-value">
                          {(entry.amount || 0).toLocaleString()} {entry.unit || 'units'}
                        </span>
                      </div>
                      <div className="history-item-row">
                        <span className="history-item-label">Remaining Stock</span>
                        <span className="history-item-value">
                          {(entry.remaining || 0).toLocaleString()} {entry.unit || 'units'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="resource-history-empty">
              <Clock className="resource-history-empty-icon" />
              <p className="resource-history-empty-text">No allocation history available</p>
              <p className="resource-history-empty-subtext">
                Allocation records will appear here once resources are distributed
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

ResourceHistoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  resourceType: PropTypes.string,
  resourceLabel: PropTypes.string,
  history: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    province: PropTypes.string,
    resource: PropTypes.string,
    amount: PropTypes.number,
    remaining: PropTypes.number,
    unit: PropTypes.string,
  })),
};

export default ResourceHistoryModal;
