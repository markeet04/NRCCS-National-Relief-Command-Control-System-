import PropTypes from 'prop-types';
import { X, History } from 'lucide-react';
import './ResourceHistoryModal.css';

/**
 * Fallback history data for District Stock resources
 */
const FALLBACK_HISTORY = {
  food: [
    { date: '2025-12-26', shelter: 'Relief Camp A', resourceType: 'Food Supplies', amountAllocated: '500 kg', remainingStock: '2,000 kg' },
    { date: '2025-12-24', shelter: 'Relief Camp B', resourceType: 'Food Supplies', amountAllocated: '350 kg', remainingStock: '2,500 kg' },
    { date: '2025-12-22', shelter: 'Emergency Shelter C', resourceType: 'Food Supplies', amountAllocated: '200 kg', remainingStock: '2,850 kg' },
  ],
  medical: [
    { date: '2025-12-25', shelter: 'Medical Camp 1', resourceType: 'Medical Kits', amountAllocated: '80 kits', remainingStock: '450 kits' },
    { date: '2025-12-23', shelter: 'Relief Camp A', resourceType: 'Medical Kits', amountAllocated: '120 kits', remainingStock: '530 kits' },
  ],
  shelter: [
    { date: '2025-12-26', shelter: 'Site Alpha', resourceType: 'Shelter Units', amountAllocated: '15 units', remainingStock: '85 units' },
    { date: '2025-12-24', shelter: 'Site Beta', resourceType: 'Shelter Units', amountAllocated: '20 units', remainingStock: '100 units' },
  ],
  water: [
    { date: '2025-12-27', shelter: 'Relief Camp A', resourceType: 'Water Supply', amountAllocated: '1,500 L', remainingStock: '8,500 L' },
    { date: '2025-12-25', shelter: 'Relief Camp B', resourceType: 'Water Supply', amountAllocated: '1,000 L', remainingStock: '10,000 L' },
  ],
  default: [
    { date: '2025-12-26', shelter: 'Relief Camp A', resourceType: 'Resources', amountAllocated: '50 units', remainingStock: '200 units' },
  ],
};

/**
 * Get fallback history data based on resource type
 */
const getFallbackHistory = (resourceType) => {
  const normalizedType = resourceType?.toLowerCase().replace(/\s+/g, '').replace('supplies', '').replace('kits', '') || 'default';
  if (normalizedType.includes('food')) return FALLBACK_HISTORY.food;
  if (normalizedType.includes('medical')) return FALLBACK_HISTORY.medical;
  if (normalizedType.includes('shelter')) return FALLBACK_HISTORY.shelter;
  if (normalizedType.includes('water')) return FALLBACK_HISTORY.water;
  return FALLBACK_HISTORY.default;
};

/**
 * ResourceHistoryModal Component for District
 * Shows allocation history for district resources to shelters
 * Uses backend data when available, falls back to sample data otherwise
 */
const ResourceHistoryModal = ({ 
  isOpen, 
  onClose, 
  resource,
  historyData: providedHistory,
}) => {
  if (!isOpen || !resource) return null;

  const resourceName = resource.name || 'Resource';
  const resourceType = resource.type || resource.name || 'default';
  
  // Use provided history from backend if available, else use fallback
  const historyData = providedHistory && providedHistory.length > 0 
    ? providedHistory 
    : getFallbackHistory(resourceType);
  
  const title = `${resourceName} Distribution History`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="district-history-overlay" onClick={onClose}>
      <div className="district-history-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="district-history-header">
          <div className="district-history-header-left">
            <div className="district-history-icon-wrapper">
              <History className="district-history-icon" />
            </div>
            <div className="district-history-header-text">
              <h3 className="district-history-title">{title}</h3>
              <p className="district-history-subtitle">
                {historyData.length} allocation{historyData.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
          <button 
            className="district-history-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Timeline Card Layout */}
        <div className="district-history-body">
          {historyData.length > 0 ? (
            <div className="district-history-timeline">
              {historyData.map((record, index) => (
                <div key={record.id || index} className="district-history-card">
                  <div className="district-history-card-indicator"></div>
                  <div className="district-history-card-content">
                    <div className="district-history-card-header">
                      <span className="district-history-card-date">{formatDate(record.date)}</span>
                      <span className="district-history-card-status">DELIVERED</span>
                    </div>
                    <div className="district-history-card-details">
                      <div className="district-history-card-row">
                        <span className="district-history-card-icon">📍</span>
                        <span className="district-history-card-label">Shelter</span>
                        <span className="district-history-card-value">{record.shelter}</span>
                      </div>
                      <div className="district-history-card-row">
                        <span className="district-history-card-label">Amount Allocated</span>
                        <span className="district-history-card-value">{record.amountAllocated}</span>
                      </div>
                      <div className="district-history-card-row">
                        <span className="district-history-card-label">Remaining Stock</span>
                        <span className="district-history-card-value">{record.remainingStock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="district-history-empty">
              <History className="district-history-empty-icon" />
              <p className="district-history-empty-text">No allocation history</p>
              <p className="district-history-empty-subtext">Allocation records will appear here</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="district-history-footer">
          <button className="district-history-close-footer-btn" onClick={onClose}>
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
  resource: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    type: PropTypes.string,
    quantity: PropTypes.number,
    allocated: PropTypes.number,
    unit: PropTypes.string,
  }),
  historyData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    shelter: PropTypes.string,
    resourceType: PropTypes.string,
    amountAllocated: PropTypes.string,
    remainingStock: PropTypes.string,
  })),
};

ResourceHistoryModal.defaultProps = {
  historyData: [],
};

export default ResourceHistoryModal;
