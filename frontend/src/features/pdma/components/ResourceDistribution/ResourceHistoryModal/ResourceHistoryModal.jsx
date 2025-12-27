import PropTypes from 'prop-types';
import { X, Clock, Package, History } from 'lucide-react';
import './ResourceHistoryModal.css';

/**
 * Dummy history data for Provincial Stock resources (fallback)
 */
const DUMMY_PROVINCIAL_HISTORY = {
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
    { date: '2025-12-26', district: 'Lahore', resourceType: 'Resources', amountAllocated: '500 units', remainingStock: '2,000 units' },
  ],
};

/**
 * Dummy history data for District Stock (fallback)
 */
const DUMMY_DISTRICT_HISTORY = {
  default: [
    { date: '2025-12-26', source: 'Provincial HQ', resourceType: 'Food, Medical', amountReceived: '200 tons, 400 kits', currentStock: '450 tons, 800 kits' },
    { date: '2025-12-24', source: 'Provincial HQ', resourceType: 'Water Supply', amountReceived: '5,000 L', currentStock: '12,000 L' },
  ],
};

/**
 * Transform activity logs to history format
 */
const transformLogsToHistory = (logs, resourceType, isDistrict, districtName) => {
  if (!logs || logs.length === 0) return [];

  // Filter allocation-related logs
  const allocationLogs = logs.filter(log => 
    log.activityType === 'resource_allocated' || 
    log.activityType === 'district_request_approved'
  );

  // If filtering by resource type
  const normalizedType = resourceType?.toLowerCase() || '';
  const filteredLogs = allocationLogs.filter(log => {
    const desc = (log.description || '').toLowerCase();
    if (isDistrict && districtName) {
      return desc.includes(districtName.toLowerCase());
    }
    if (normalizedType && normalizedType !== 'default') {
      return desc.includes(normalizedType);
    }
    return true;
  });

  return filteredLogs.map(log => {
    // Parse description to extract details
    // Format: "User allocated X units of Resource to district Y"
    const desc = log.description || '';
    const quantityMatch = desc.match(/(\d+[\d,]*)\s*(kg|liters|kits|units|tons)?/i);
    const amount = quantityMatch ? quantityMatch[0] : 'N/A';

    return {
      date: log.createdAt || log.timestamp,
      district: log.districtName || extractDistrictFromDesc(desc),
      source: 'Provincial HQ',
      resourceType: log.title || 'Resource',
      amountAllocated: amount,
      amountReceived: amount,
      remainingStock: 'Updated',
      currentStock: 'Updated',
      rawDescription: desc,
    };
  });
};

const extractDistrictFromDesc = (desc) => {
  const match = desc.match(/to district\s+(\w+)/i) || desc.match(/to\s+(\w+)\s+district/i);
  return match ? match[1] : 'District';
};

/**
 * Get history data - prefers real data, falls back to dummy
 */
const getHistoryData = (resourceType, isDistrict, activityLogs, districtName) => {
  // Try to get real data from activity logs first
  const realHistory = transformLogsToHistory(activityLogs, resourceType, isDistrict, districtName);
  
  if (realHistory.length > 0) {
    return realHistory;
  }

  // Fallback to dummy data
  if (isDistrict) {
    return DUMMY_DISTRICT_HISTORY.default;
  }
  
  const normalizedType = resourceType?.toLowerCase().replace(/\s+/g, '').replace('supplies', '').replace('kits', '') || 'default';
  if (normalizedType.includes('food')) return DUMMY_PROVINCIAL_HISTORY.food;
  if (normalizedType.includes('medical')) return DUMMY_PROVINCIAL_HISTORY.medical;
  if (normalizedType.includes('shelter')) return DUMMY_PROVINCIAL_HISTORY.shelter;
  if (normalizedType.includes('water')) return DUMMY_PROVINCIAL_HISTORY.water;
  
  return DUMMY_PROVINCIAL_HISTORY.default;
};

/**
 * ResourceHistoryModal Component
 * Shows allocation/distribution history for Provincial and District resources
 * Uses real activity logs from backend when available, falls back to dummy data
 */
const ResourceHistoryModal = ({ 
  isOpen, 
  onClose, 
  resourceName = 'Resource',
  resourceType = 'default',
  isDistrict = false,
  districtName = '',
  activityLogs = [],
}) => {
  if (!isOpen) return null;

  const historyData = getHistoryData(resourceType, isDistrict, activityLogs, districtName);
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
                <div key={index} className="pdma-history-card">
                  <div className="pdma-history-card-indicator"></div>
                  <div className="pdma-history-card-content">
                    <div className="pdma-history-card-header">
                      <span className="pdma-history-card-date">{formatDate(record.date)}</span>
                      <span className="pdma-history-card-status">DELIVERED</span>
                    </div>
                    <div className="pdma-history-card-details">
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-icon">📍</span>
                        <span className="pdma-history-card-label">{isDistrict ? 'Source' : 'Province'}</span>
                        <span className="pdma-history-card-value">
                          {isDistrict ? record.source : record.district}
                        </span>
                      </div>
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-label">Amount Allocated</span>
                        <span className="pdma-history-card-value">
                          {isDistrict ? record.amountReceived : record.amountAllocated}
                        </span>
                      </div>
                      <div className="pdma-history-card-row">
                        <span className="pdma-history-card-label">Remaining Stock</span>
                        <span className="pdma-history-card-value">
                          {isDistrict ? record.currentStock : record.remainingStock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pdma-history-empty">
              <Clock className="pdma-history-empty-icon" />
              <p className="pdma-history-empty-text">No history records</p>
              <p className="pdma-history-empty-subtext">
                No allocation records found for this resource
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
  activityLogs: PropTypes.array,
};

export default ResourceHistoryModal;
