import PropTypes from 'prop-types';
import { X, History } from 'lucide-react';
import './ResourceHistoryModal.css';

/**
 * Fallback history data for Provincial Stock resources
 */
const FALLBACK_HISTORY = {
  food: [
    { date: '2025-12-26', district: 'Lahore', resourceType: 'Food Supplies', amountAllocated: '500 tons', remainingStock: '2,000 tons' },
    { date: '2025-12-24', district: 'Faisalabad', resourceType: 'Food Supplies', amountAllocated: '350 tons', remainingStock: '2,500 tons' },
    { date: '2025-12-22', district: 'Multan', resourceType: 'Food Supplies', amountAllocated: '200 tons', remainingStock: '2,850 tons' },
  ],
  medical: [
    { date: '2025-12-25', district: 'Lahore', resourceType: 'Medical Kits', amountAllocated: '800 kits', remainingStock: '4,500 kits' },
    { date: '2025-12-23', district: 'Karachi', resourceType: 'Medical Kits', amountAllocated: '1,200 kits', remainingStock: '5,300 kits' },
  ],
  shelter: [
    { date: '2025-12-26', district: 'Muzaffargarh', resourceType: 'Shelter Units', amountAllocated: '150 units', remainingStock: '850 units' },
    { date: '2025-12-24', district: 'Rajanpur', resourceType: 'Shelter Units', amountAllocated: '200 units', remainingStock: '1,000 units' },
  ],
  water: [
    { date: '2025-12-27', district: 'Lahore', resourceType: 'Water Supply', amountAllocated: '15,000 L', remainingStock: '85,000 L' },
    { date: '2025-12-25', district: 'Faisalabad', resourceType: 'Water Supply', amountAllocated: '10,000 L', remainingStock: '100,000 L' },
  ],
  default: [
    { date: '2025-12-26', district: 'District', resourceType: 'Resources', amountAllocated: '500 units', remainingStock: '2,000 units' },
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
 * ResourceHistoryModal Component for PDMA
 * Shows allocation history for provincial resources to districts
 * Uses backend data when available via historyData prop, falls back to sample data otherwise
 */
const ResourceHistoryModal = ({
  isOpen,
  onClose,
  resourceName = 'Resource',
  resourceType = 'default',
  isDistrict = false,
  districtName = '',
  historyData: providedHistory,
}) => {
  if (!isOpen) return null;

  // Use provided history from backend if available, else use fallback
  const historyData = providedHistory && providedHistory.length > 0
    ? providedHistory
    : getFallbackHistory(resourceType);

  const title = isDistrict
    ? `${districtName} Allocation History`
    : `${resourceName} Distribution History`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="pdma-history-overlay" onClick={onClose}>
      <div className="pdma-history-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pdma-history-header">
          <div className="pdma-history-header-left">
            <div className="pdma-history-icon-wrapper">
              <History className="pdma-history-icon" />
            </div>
            <div className="pdma-history-header-text">
              <h3 className="pdma-history-title">{title}</h3>
              <p className="pdma-history-subtitle">
                {historyData.length} allocation{historyData.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
          <button
            className="pdma-history-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Timeline Card Layout */}
        <div className="pdma-history-body">
          {historyData.length > 0 ? (
            <div className="pdma-history-timeline">
              {historyData.map((record, index) => (
                <div key={record.id || index} className="pdma-history-card">
                  <div className="pdma-history-card-indicator"></div>
                  <div className="pdma-history-card-content">
                    <div className="pdma-history-card-header">
                      <span className="pdma-history-card-date">{formatDate(record.date)}</span>
                      <span className="pdma-history-card-status">DELIVERED</span>
                    </div>
                    <div className="pdma-history-card-details">
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-icon">📍</span>
                        <span className="pdma-history-card-label">{isDistrict ? 'Source' : 'District'}</span>
                        <span className="pdma-history-card-value">
                          {isDistrict ? (record.source || 'Provincial HQ') : (record.district || record.shelter || 'District')}
                        </span>
                      </div>
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-label">Amount Allocated</span>
                        <span className="pdma-history-card-value">
                          {record.amountAllocated || record.amountReceived || 'N/A'}
                        </span>
                      </div>
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-label">Remaining Stock</span>
                        <span className="pdma-history-card-value">
                          {record.remainingStock || record.currentStock || 'Updated'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pdma-history-empty">
              <History className="pdma-history-empty-icon" />
              <p className="pdma-history-empty-text">No allocation history</p>
              <p className="pdma-history-empty-subtext">
                Allocation records will appear here after resources are distributed
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pdma-history-footer">
          <button
            className="pdma-history-close-footer-btn"
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
  resourceName: PropTypes.string,
  resourceType: PropTypes.string,
  isDistrict: PropTypes.bool,
  districtName: PropTypes.string,
  historyData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    date: PropTypes.string,
    district: PropTypes.string,
    shelter: PropTypes.string,
    source: PropTypes.string,
    resourceType: PropTypes.string,
    amountAllocated: PropTypes.string,
    amountReceived: PropTypes.string,
    remainingStock: PropTypes.string,
    currentStock: PropTypes.string,
  })),
};

ResourceHistoryModal.defaultProps = {
  historyData: [],
};

export default ResourceHistoryModal;
