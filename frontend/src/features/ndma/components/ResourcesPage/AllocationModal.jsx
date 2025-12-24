import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * AllocationModal Component
 * Modal for allocating resources to provinces
 * Uses CSS classes from global-ndma.css and resource-allocation.css
 */
const AllocationModal = ({
  isOpen,
  onClose,
  province,
  formData,
  onChange,
  onSubmit,
  loading,
}) => {
  if (!isOpen) return null;

  const resourceFields = [
    { key: 'food', label: 'Food Supplies', unit: 'tons', max: 10000 },
    { key: 'medical', label: 'Medical Kits', unit: 'kits', max: 20000 },
    { key: 'shelter', label: 'Shelter Materials', unit: 'units', max: 5000 },
    { key: 'water', label: 'Clean Water', unit: 'liters', max: 200000 },
  ];

  return (
    <div className="ndma-modal-overlay">
      <div className="ndma-modal">
        {/* Header */}
        <div className="ndma-modal-header">
          <div>
            <h3 className="ndma-heading-md">Allocate Resources</h3>
            <p className="ndma-text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {province ? `Allocating to ${province}` : 'Select a province'}
            </p>
          </div>
          <button
            className="ndma-btn-ghost"
            onClick={onClose}
            aria-label="Close allocation modal"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="ndma-modal-body">
          <div className="resources-modal-form">
            {resourceFields.map((field) => (
              <div key={field.key} className="resources-form-group">
                <label className="ndma-label">
                  {field.label} ({field.unit})
                </label>
                <div className="resources-form-row">
                  <input
                    type="range"
                    min="0"
                    max={field.max}
                    value={formData[field.key] || 0}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="ndma-range"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    min="0"
                    max={field.max}
                    value={formData[field.key] || 0}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="ndma-input ndma-input-number"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="ndma-summary-box">
            <p className="ndma-label" style={{ marginBottom: '0.75rem' }}>
              Allocation Summary
            </p>
            <div className="resources-summary-grid">
              {resourceFields.map((field) => (
                <div key={field.key} className="resources-summary-item">
                  <span className="resources-summary-label">{field.label}:</span>
                  <span className="resources-summary-value">
                    {(formData[field.key] || 0).toLocaleString()} {field.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ndma-modal-footer resources-modal-actions">
          <button
            type="button"
            className="ndma-btn ndma-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ndma-btn ndma-btn-primary"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Allocating...' : 'Confirm Allocation'}
          </button>
        </div>
      </div>
    </div>
  );
};

AllocationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  province: PropTypes.string,
  formData: PropTypes.shape({
    food: PropTypes.number,
    medical: PropTypes.number,
    shelter: PropTypes.number,
    water: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

AllocationModal.defaultProps = {
  province: null,
  loading: false,
};

export default AllocationModal;
