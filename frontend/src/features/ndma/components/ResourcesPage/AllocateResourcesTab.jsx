import PropTypes from 'prop-types';
import { Send, Package, Droplets, Home, Stethoscope, ChevronDown } from 'lucide-react';

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
 * AllocateResourcesTab Component
 * Allocation form with stats panel for distributing resources to provinces
 */
const AllocateResourcesTab = ({
  allocateForm,
  onFormChange,
  onSubmit,
  allocating,
  provinces,
  provincialAllocations,
  nationalStock,
  allocationHistory,
}) => {
  return (
    <div className="allocate-resources-section">
      <div className="allocate-section-header">
        <h2 className="allocate-section-title">Allocate Resources to Provinces</h2>
        <p className="allocate-section-subtitle">Distribute national stock to provincial authorities</p>
      </div>

      <div className="allocate-content-grid">
        {/* Allocation Form */}
        <div className="allocate-form-card">
          <form onSubmit={onSubmit} className="allocate-form">
            {/* Target Province */}
            <div className="allocate-form-group">
              <label className="allocate-form-label">Target Province *</label>
              <div className="allocate-select-wrapper">
                <select
                  value={allocateForm.targetProvince}
                  onChange={(e) => onFormChange('targetProvince', e.target.value)}
                  className="allocate-form-select"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.length > 0 ? (
                    provinces.map((province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))
                  ) : (
                    provincialAllocations.map((alloc) => (
                      <option key={alloc.province} value={alloc.province}>
                        {alloc.province}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="allocate-select-icon" />
              </div>
            </div>

            {/* Resource Type */}
            <div className="allocate-form-group">
              <label className="allocate-form-label">Resource Type *</label>
              <div className="allocate-resource-options">
                {RESOURCE_TYPES.map((resource) => {
                  const IconComponent = resource.icon;
                  return (
                    <button
                      key={resource.id}
                      type="button"
                      className={`allocate-resource-option ${allocateForm.resourceType === resource.id ? 'active' : ''}`}
                      onClick={() => onFormChange('resourceType', resource.id)}
                    >
                      <IconComponent className="allocate-resource-icon" />
                      <span>{resource.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="allocate-form-group">
              <label className="allocate-form-label">
                Quantity * {allocateForm.resourceType && `(${RESOURCE_TYPES.find(r => r.id === allocateForm.resourceType)?.unit || 'units'})`}
              </label>
              <input
                type="number"
                value={allocateForm.quantity}
                onChange={(e) => onFormChange('quantity', e.target.value)}
                className="allocate-form-input"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Priority */}
            <div className="allocate-form-group">
              <label className="allocate-form-label">Priority Level</label>
              <div className="allocate-priority-options">
                {['low', 'normal', 'high', 'critical'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    className={`allocate-priority-option priority-${priority} ${allocateForm.priority === priority ? 'active' : ''}`}
                    onClick={() => onFormChange('priority', priority)}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="allocate-form-group">
              <label className="allocate-form-label">Notes (Optional)</label>
              <textarea
                value={allocateForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                className="allocate-form-textarea"
                placeholder="Add any additional notes or instructions..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="allocate-submit-btn" disabled={allocating}>
              <Send className="allocate-submit-icon" />
              {allocating ? 'Allocating...' : 'Allocate Resources'}
            </button>
          </form>
        </div>

        {/* Quick Stats Panel */}
        <div className="allocate-stats-panel">
          <h3 className="allocate-stats-title">Available Stock</h3>
          <div className="allocate-stats-list">
            {Object.entries(nationalStock).map(([type, data]) => {
              const total = data.available || 0;
              const allocated = data.allocated || 0;
              const remaining = total - allocated;
              const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;
              return (
                <div key={type} className="allocate-stat-item">
                  <div className="allocate-stat-header">
                    <span className="allocate-stat-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span className="allocate-stat-value">{remaining.toLocaleString()} / {total.toLocaleString()} {data.unit}</span>
                  </div>
                  <div className="allocate-stat-bar">
                    <div 
                      className={`allocate-stat-progress ${percentage < 30 ? 'low' : percentage < 60 ? 'medium' : 'high'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Allocations */}
          <div className="allocate-recent">
            <h4 className="allocate-recent-title">Recent Allocations</h4>
            <div className="allocate-recent-list">
              {Object.values(allocationHistory).flat().slice(0, 5).map((allocation, idx) => (
                <div key={idx} className="allocate-recent-item">
                  <span className="allocate-recent-province">{allocation.province || 'Unknown'}</span>
                  <span className="allocate-recent-resource">
                    {allocation.items?.[0]?.name || 'Resource'} - {allocation.items?.[0]?.quantity || 0} units
                  </span>
                  <span className="allocate-recent-time">
                    {new Date(allocation.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {Object.values(allocationHistory).flat().length === 0 && (
                <div className="allocate-recent-empty">
                  <p className="allocate-empty-text">No recent allocations</p>
                </div>
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
    targetProvince: PropTypes.string,
    resourceType: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priority: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  allocating: PropTypes.bool,
  provinces: PropTypes.array,
  provincialAllocations: PropTypes.array,
  nationalStock: PropTypes.object,
  allocationHistory: PropTypes.object,
};

AllocateResourcesTab.defaultProps = {
  allocating: false,
  provinces: [],
  provincialAllocations: [],
  nationalStock: {},
  allocationHistory: {},
};

export default AllocateResourcesTab;
