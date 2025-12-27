import PropTypes from 'prop-types';
import { Send, Package, Droplets, Home, Stethoscope, ChevronDown, Check, Clock, Truck } from 'lucide-react';
import './AllocateResourcesTab.css';

/**
 * Resource types configuration
 */
const RESOURCE_TYPES = [
  { id: 'food', label: 'Food Supplies', icon: Package, unit: 'tons' },
  { id: 'water', label: 'Water', icon: Droplets, unit: 'liters' },
  { id: 'medical', label: 'Medical Supplies', icon: Stethoscope, unit: 'kits' },
  { id: 'shelter', label: 'Shelter Materials', icon: Home, unit: 'units' },
];

/**
 * Priority levels with display names
 */
const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' },
];

/**
 * Dummy Recent Allocations data (fallback)
 */
const DUMMY_RECENT_ALLOCATIONS = [
  { id: 1, date: '2025-12-27', district: 'Lahore', resources: 'Food: 200 tons, Medical: 500 kits', status: 'completed' },
  { id: 2, date: '2025-12-26', district: 'Faisalabad', resources: 'Water: 8,000 L, Shelter: 50 units', status: 'completed' },
  { id: 3, date: '2025-12-26', district: 'Multan', resources: 'Food: 150 tons', status: 'in-transit' },
  { id: 4, date: '2025-12-25', district: 'Rawalpindi', resources: 'Medical: 300 kits, Water: 5,000 L', status: 'completed' },
  { id: 5, date: '2025-12-25', district: 'Gujranwala', resources: 'Shelter: 80 units', status: 'pending' },
  { id: 6, date: '2025-12-24', district: 'Sialkot', resources: 'Food: 100 tons, Medical: 200 kits', status: 'completed' },
];

/**
 * Get status icon
 */
const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <Check size={12} />;
    case 'in-transit': return <Truck size={12} />;
    default: return <Clock size={12} />;
  }
};

/**
 * AllocateResourcesTab Component (PDMA Version)
 * Allocation form with stats panel for distributing resources to districts
 */
const AllocateResourcesTab = ({
  allocateForm,
  onFormChange,
  onSubmit,
  allocating,
  districts,
  districtAllocations,
  provincialStock,
  allocationHistory,
}) => {
  return (
    <div className="pdma-allocate-resources-section">
      <div className="pdma-allocate-section-header">
        <h2 className="pdma-allocate-section-title">Allocate Resources to Districts</h2>
        <p className="pdma-allocate-section-subtitle">Distribute provincial stock to district authorities</p>
      </div>

      <div className="pdma-allocate-content-grid">
        {/* Allocation Form */}
        <div className="pdma-allocate-form-card">
          <form onSubmit={onSubmit} className="pdma-allocate-form">
            {/* Target District */}
            <div className="pdma-allocate-form-group">
              <label className="pdma-allocate-form-label">Target District *</label>
              <div className="pdma-allocate-select-wrapper">
                <select
                  value={allocateForm.targetDistrict}
                  onChange={(e) => onFormChange('targetDistrict', e.target.value)}
                  className="pdma-allocate-form-select"
                  required
                >
                  <option value="">Select District</option>
                  {districts && districts.length > 0 ? (
                    districts.map((district) => (
                      <option key={district.id || district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))
                  ) : (
                    districtAllocations && districtAllocations.map((alloc) => (
                      <option key={alloc.district} value={alloc.district}>
                        {alloc.district}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pdma-allocate-select-icon" />
              </div>
            </div>

            {/* Resource Type */}
            <div className="pdma-allocate-form-group">
              <label className="pdma-allocate-form-label">Resource Type *</label>
              <div className="pdma-allocate-resource-options">
                {RESOURCE_TYPES.map((resource) => {
                  const IconComponent = resource.icon;
                  return (
                    <button
                      key={resource.id}
                      type="button"
                      className={`pdma-allocate-resource-option ${allocateForm.resourceType === resource.id ? 'active' : ''}`}
                      onClick={() => onFormChange('resourceType', resource.id)}
                    >
                      <IconComponent className="pdma-allocate-resource-icon" />
                      <span>{resource.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="pdma-allocate-form-group">
              <label className="pdma-allocate-form-label">
                Quantity * {allocateForm.resourceType && `(${RESOURCE_TYPES.find(r => r.id === allocateForm.resourceType)?.unit || 'units'})`}
              </label>
              <input
                type="number"
                value={allocateForm.quantity}
                onChange={(e) => onFormChange('quantity', e.target.value)}
                className="pdma-allocate-form-input"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Priority */}
            <div className="pdma-allocate-form-group">
              <label className="pdma-allocate-form-label">Priority Level</label>
              <div className="pdma-allocate-priority-options">
                {PRIORITY_LEVELS.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    className={`pdma-allocate-priority-option priority-${priority.id} ${allocateForm.priority === priority.id ? 'active' : ''}`}
                    onClick={() => onFormChange('priority', priority.id)}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="pdma-allocate-form-group">
              <label className="pdma-allocate-form-label">Notes (Optional)</label>
              <textarea
                value={allocateForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                className="pdma-allocate-form-textarea"
                placeholder="Add any additional notes or instructions..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="pdma-allocate-submit-btn" disabled={allocating}>
              <Send className="pdma-allocate-submit-icon" />
              {allocating ? 'Allocating...' : 'Allocate Resources'}
            </button>
          </form>
        </div>

        {/* Quick Stats Panel */}
        <div className="pdma-allocate-stats-panel">
          <h3 className="pdma-allocate-stats-title">Available Provincial Stock</h3>
          <div className="pdma-allocate-stats-list">
            {provincialStock && Object.entries(provincialStock).map(([type, data]) => {
              const total = data.available || data.total || 0;
              const allocated = data.allocated || 0;
              const remaining = total - allocated;
              const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;
              return (
                <div key={type} className="pdma-allocate-stat-item">
                  <div className="pdma-allocate-stat-header">
                    <span className="pdma-allocate-stat-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span className="pdma-allocate-stat-value">{remaining.toLocaleString()} / {total.toLocaleString()} {data.unit || 'units'}</span>
                  </div>
                  <div className="pdma-allocate-stat-bar">
                    <div 
                      className={`pdma-allocate-stat-progress ${percentage < 30 ? 'low' : percentage < 60 ? 'medium' : 'high'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!provincialStock || Object.keys(provincialStock).length === 0) && (
              <div className="pdma-allocate-empty">
                <p className="pdma-allocate-empty-text">No stock data available</p>
              </div>
            )}
          </div>

          {/* Recent Allocations - Uses backend activity logs if available */}
          <div className="pdma-allocate-recent">
            <h4 className="pdma-allocate-recent-title">Recent Allocations</h4>
            <div className="pdma-allocate-recent-list">
              {/* Use backend data if available, otherwise use dummy */}
              {(allocationHistory?.allocations && allocationHistory.allocations.length > 0) ? (
                allocationHistory.allocations.slice(0, 6).map((log, idx) => (
                  <div key={log.id || idx} className="pdma-allocate-recent-item">
                    <span className="pdma-allocate-recent-district">
                      {log.title || 'Resource Allocated'}
                    </span>
                    <span className="pdma-allocate-recent-resource">
                      {log.description?.substring(0, 60) || 'Allocation completed'}
                      {log.description?.length > 60 ? '...' : ''}
                    </span>
                    <span className="pdma-allocate-recent-status status-completed">
                      {getStatusIcon('completed')}
                      {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                DUMMY_RECENT_ALLOCATIONS.slice(0, 6).map((allocation) => (
                  <div key={allocation.id} className="pdma-allocate-recent-item">
                    <span className="pdma-allocate-recent-district">{allocation.district}</span>
                    <span className="pdma-allocate-recent-resource">{allocation.resources}</span>
                    <span className={`pdma-allocate-recent-status status-${allocation.status}`}>
                      {getStatusIcon(allocation.status)}
                      {allocation.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AllocateResourcesTab.propTypes = {
  allocateForm: PropTypes.shape({
    targetDistrict: PropTypes.string,
    resourceType: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priority: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  allocating: PropTypes.bool,
  districts: PropTypes.array,
  districtAllocations: PropTypes.array,
  provincialStock: PropTypes.object,
  allocationHistory: PropTypes.object,
};

AllocateResourcesTab.defaultProps = {
  allocating: false,
  districts: [],
  districtAllocations: [],
  provincialStock: {},
  allocationHistory: {},
};

export default AllocateResourcesTab;
