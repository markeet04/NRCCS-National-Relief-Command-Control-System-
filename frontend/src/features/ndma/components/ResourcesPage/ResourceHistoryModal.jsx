import PropTypes from 'prop-types';
import { X, Clock, Package, Stethoscope, Home, Droplets, MapPin, TrendingDown } from 'lucide-react';

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
 * Premium dark theme with improved styling
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate usage percentage for each entry
  const getUsagePercent = (allocated, remaining) => {
    const total = allocated + remaining;
    return total > 0 ? Math.round((allocated / total) * 100) : 0;
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
              <p className="resource-history-subtitle">Allocation timeline and usage tracking</p>
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

        {/* Table */}
        <div className="resource-history-body">
          {history && history.length > 0 ? (
            <div className="resource-history-table-wrapper">
              <table className="resource-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Province</th>
                    <th>Resource</th>
                    <th>Amount</th>
                    <th>Remaining</th>
                    <th>Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => {
                    const usagePercent = getUsagePercent(entry.amount || 0, entry.remaining || 0);
                    return (
                      <tr key={index}>
                        <td>
                          <div className="resource-history-date">
                            <span className="resource-history-date-main">{formatDate(entry.date)}</span>
                            {entry.time && (
                              <span className="resource-history-date-time">{formatTime(entry.date)}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="resource-history-province">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{entry.province}</span>
                          </div>
                        </td>
                        <td>
                          <span className="resource-history-resource">{entry.resource || resourceLabel}</span>
                        </td>
                        <td>
                          <span className="resource-history-amount">
                            {(entry.amount || 0).toLocaleString()} {entry.unit || 'units'}
                          </span>
                        </td>
                        <td>
                          <span className="resource-history-remaining">
                            {(entry.remaining || 0).toLocaleString()} {entry.unit || 'units'}
                          </span>
                        </td>
                        <td>
                          <div className="resource-history-usage">
                            <div className="resource-history-usage-bar">
                              <div 
                                className="resource-history-usage-fill"
                                style={{ 
                                  width: `${usagePercent}%`,
                                  backgroundColor: usagePercent > 70 ? '#ef4444' : usagePercent > 50 ? '#f97316' : '#22c55e'
                                }}
                              />
                            </div>
                            <span className="resource-history-usage-percent">{usagePercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

        {/* Summary Stats */}
        {history && history.length > 0 && (
          <div className="resource-history-summary">
            <div className="resource-history-summary-item">
              <span className="resource-history-summary-label">Total Allocations</span>
              <span className="resource-history-summary-value">{history.length}</span>
            </div>
            <div className="resource-history-summary-item">
              <span className="resource-history-summary-label">Total Distributed</span>
              <span className="resource-history-summary-value">
                {history.reduce((sum, entry) => sum + (entry.amount || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="resource-history-summary-item">
              <span className="resource-history-summary-label">Provinces Served</span>
              <span className="resource-history-summary-value">
                {new Set(history.map(entry => entry.province)).size}
              </span>
            </div>
          </div>
        )}

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
