import PropTypes from 'prop-types';
import { Send, Package, Droplets, Home, Stethoscope, ChevronDown, Check, Clock, Truck } from 'lucide-react';
import './AllocateToSheltersTab.css';

/**
 * Resource types configuration
 */
const RESOURCE_TYPES = [
  { id: 'food', label: 'Food Supplies', icon: Package, unit: 'kg' },
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
 * AllocateToSheltersTab Component (District Version)
 * Allocation form with stats panel for distributing resources to shelters
 */
const AllocateToSheltersTab = ({
  allocateForm,
  onFormChange,
  onSubmit,
  allocating,
  shelters,
  districtStock,
  recentAllocations,
}) => {
  // Default dummy allocations if none provided
  const dummyRecentAllocations = [
    { id: 1, date: '12/27/2025', shelter: 'Sindh', resources: 'food - 10 units', status: 'completed' },
    { id: 2, date: '12/27/2025', shelter: 'Sindh', resources: 'medical - 10 units', status: 'completed' },
  ];

  const displayAllocations = recentAllocations?.length > 0 ? recentAllocations : dummyRecentAllocations;

  return (
    <div className="district-allocate-section">
      <div className="district-allocate-header">
        <h2 className="district-allocate-title">Allocate Resources to Shelters</h2>
        <p className="district-allocate-subtitle">Distribute district stock to shelter authorities</p>
      </div>

      <div className="district-allocate-grid">
        {/* Allocation Form */}
        <div className="district-allocate-form-card">
          <form onSubmit={onSubmit} className="district-allocate-form">
            {/* Target Shelter */}
            <div className="district-allocate-form-group">
              <label className="district-allocate-form-label">Target Shelter *</label>
              <div className="district-allocate-select-wrapper">
                <select
                  value={allocateForm.targetShelter}
                  onChange={(e) => onFormChange('targetShelter', e.target.value)}
                  className="district-allocate-form-select"
                  required
                >
                  <option value="">Select Shelter</option>
                  {shelters && shelters.length > 0 ? (
                    shelters.map((shelter) => (
                      <option key={shelter.id || shelter.name} value={shelter.id || shelter.name}>
                        {shelter.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="relief-camp-a">Relief Camp A</option>
                      <option value="relief-camp-b">Relief Camp B</option>
                      <option value="emergency-shelter-c">Emergency Shelter C</option>
                    </>
                  )}
                </select>
                <ChevronDown className="district-allocate-select-icon" />
              </div>
            </div>

            {/* Resource Type */}
            <div className="district-allocate-form-group">
              <label className="district-allocate-form-label">Resource Type *</label>
              <div className="district-allocate-resource-options">
                {RESOURCE_TYPES.map((resource) => {
                  const IconComponent = resource.icon;
                  return (
                    <button
                      key={resource.id}
                      type="button"
                      className={`district-allocate-resource-option ${allocateForm.resourceType === resource.id ? 'active' : ''}`}
                      onClick={() => onFormChange('resourceType', resource.id)}
                    >
                      <IconComponent className="district-allocate-resource-icon" />
                      <span>{resource.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="district-allocate-form-group">
              <label className="district-allocate-form-label">
                Quantity * {allocateForm.resourceType && `(${RESOURCE_TYPES.find(r => r.id === allocateForm.resourceType)?.unit || 'units'})`}
              </label>
              <input
                type="number"
                value={allocateForm.quantity}
                onChange={(e) => onFormChange('quantity', e.target.value)}
                className="district-allocate-form-input"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Priority */}
            <div className="district-allocate-form-group">
              <label className="district-allocate-form-label">Priority Level</label>
              <div className="district-allocate-priority-options">
                {PRIORITY_LEVELS.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    className={`district-allocate-priority-option priority-${priority.id} ${allocateForm.priority === priority.id ? 'active' : ''}`}
                    onClick={() => onFormChange('priority', priority.id)}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="district-allocate-form-group">
              <label className="district-allocate-form-label">Notes (Optional)</label>
              <textarea
                value={allocateForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                className="district-allocate-form-textarea"
                placeholder="Add any additional notes or instructions..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="district-allocate-submit-btn" disabled={allocating}>
              <Send className="district-allocate-submit-icon" />
              {allocating ? 'Allocating...' : 'Allocate Resources'}
            </button>
          </form>
        </div>

        {/* Available Stock Panel */}
        <div className="district-allocate-stats-panel">
          <h3 className="district-allocate-stats-title">Available Stock</h3>
          <div className="district-allocate-stats-list">
            {districtStock && Object.entries(districtStock).map(([type, data]) => {
              const total = data.total || data.available || 0;
              const allocated = data.allocated || 0;
              const remaining = total - allocated;
              const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;
              return (
                <div key={type} className="district-allocate-stat-item">
                  <div className="district-allocate-stat-header">
                    <span className="district-allocate-stat-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span className="district-allocate-stat-value">{remaining.toLocaleString()} / {total.toLocaleString()} {data.unit || 'units'}</span>
                  </div>
                  <div className="district-allocate-stat-bar">
                    <div 
                      className={`district-allocate-stat-progress ${percentage < 30 ? 'low' : percentage < 60 ? 'medium' : 'high'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!districtStock || Object.keys(districtStock).length === 0) && (
              <div className="district-allocate-empty">
                <p className="district-allocate-empty-text">No stock data available</p>
              </div>
            )}
          </div>

          {/* Recent Allocations */}
          <div className="district-allocate-recent">
            <h4 className="district-allocate-recent-title">Recent Allocations</h4>
            <div className="district-allocate-recent-list">
              {displayAllocations.slice(0, 5).map((allocation, index) => (
                <div key={allocation.id || index} className="district-allocate-recent-item">
                  <span className="district-allocate-recent-shelter">{allocation.shelter}</span>
                  <span className="district-allocate-recent-resource">{allocation.resources}</span>
                  <span className="district-allocate-recent-time">{allocation.date}</span>
                </div>
              ))}
              {displayAllocations.length === 0 && (
                <div className="district-allocate-recent-empty">
                  <p className="district-allocate-empty-text">No recent allocations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AllocateToSheltersTab.propTypes = {
  allocateForm: PropTypes.shape({
    targetShelter: PropTypes.string,
    resourceType: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priority: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  allocating: PropTypes.bool,
  shelters: PropTypes.array,
  districtStock: PropTypes.object,
  recentAllocations: PropTypes.array,
};

AllocateToSheltersTab.defaultProps = {
  allocating: false,
  shelters: [],
  districtStock: null,
  recentAllocations: [],
};

export default AllocateToSheltersTab;
