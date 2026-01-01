import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Clock, Package, Stethoscope, Home, Droplets, MapPin } from 'lucide-react';
import NdmaApiService from '@shared/services/NdmaApiService.js';
import { PageLoader } from '@shared/components/ui';

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
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  // Fetch allocation history filtered by resource type
  useEffect(() => {
    if (!isOpen) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await NdmaApiService.getAllocationHistory();

        // Map resource types
        const typeMapping = {
          'food': ['food', 'Food Supplies', 'food supplies'],
          'medical': ['medical', 'Medical Kits', 'medical kits', 'medicine'],
          'shelter': ['shelter', 'Shelter Tents', 'shelter tents', 'tent'],
          'water': ['water', 'Water', 'drinking water'],
        };

        // Filter by resource type
        const filtered = (data || []).filter(item => {
          const itemType = (item.resource?.type || item.resourceType || item.resourceName || '').toLowerCase();
          const matchTypes = typeMapping[resourceType] || [resourceType];
          return matchTypes.some(t => itemType.includes(t.toLowerCase()));
        });

        // Get national resources to calculate remaining stock
        const nationalResources = await NdmaApiService.getNationalResources();

        // Find the current resource stock
        const currentResource = nationalResources.find(r => {
          const rType = (r.type || r.resourceType || '').toLowerCase();
          const matchTypes = typeMapping[resourceType] || [resourceType];
          return matchTypes.some(t => rType.includes(t.toLowerCase()));
        });

        // Transform to expected format with calculated remaining stock
        const transformed = filtered.map((item, index) => {
          // Calculate remaining stock: current available - sum of all previous allocations
          const previousAllocations = filtered.slice(0, index);
          const totalAllocated = previousAllocations.reduce((sum, alloc) => sum + (alloc.quantity || 0), 0);
          const remaining = currentResource ? (currentResource.quantity - currentResource.allocated - totalAllocated) : 0;

          return {
            date: item.allocatedAt || item.createdAt,
            province: item.province?.name || item.provinceName || 'Unknown',
            resource: item.resource?.type || item.resourceType || item.resourceName || resourceType,
            amount: item.quantity || 0,
            remaining: Math.max(0, remaining),
            unit: item.resource?.unit || item.unit || currentResource?.unit || 'units',
          };
        });

        setHistoryData(transformed);
      } catch (error) {
        NotificationService.showError('Failed to fetch resource history. Please try again.');
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, resourceType]);

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
  const displayHistory = historyData.length > 0 ? historyData : history;

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
          {loading ? (
            <PageLoader message="Loading allocation history..." />
          ) : displayHistory && displayHistory.length > 0 ? (
            <div className="history-timeline">
              {displayHistory.map((entry, index) => (
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
