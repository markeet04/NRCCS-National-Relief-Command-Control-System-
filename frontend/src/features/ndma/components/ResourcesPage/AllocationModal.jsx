import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * AllocationModal Component
 * Modal for allocating resources to provinces
 */
const AllocationModal = ({
  isOpen,
  onClose,
  province,
  formData,
  onChange,
  onSubmit,
  loading,
  colors,
  isLight,
}) => {
  if (!isOpen) return null;

  const resourceFields = [
    { key: 'food', label: 'Food Supplies', unit: 'tons', max: 10000 },
    { key: 'medical', label: 'Medical Kits', unit: 'kits', max: 20000 },
    { key: 'shelter', label: 'Shelter Materials', unit: 'units', max: 5000 },
    { key: 'water', label: 'Clean Water', unit: 'liters', max: 200000 },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '480px',
          backgroundColor: colors.modalBg,
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.textPrimary, margin: 0 }}
            >
              Allocate Resources
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: colors.textSecondary }}
            >
              {province ? `Allocating to ${province}` : 'Select a province'}
            </p>
          </div>
          <button
            className="p-1.5 rounded transition-colors"
            style={{
              color: colors.textSecondary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onClose}
            aria-label="Close allocation modal"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resourceFields.map((field) => (
              <div key={field.key}>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  {field.label} ({field.unit})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={field.max}
                    value={formData[field.key] || 0}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="flex-1"
                    style={{
                      accentColor: '#3b82f6',
                      height: '8px',
                    }}
                    disabled={loading}
                  />
                  <input
                    type="number"
                    min="0"
                    max={field.max}
                    value={formData[field.key] || 0}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-24 rounded-md text-right"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      padding: '8px 12px',
                      fontSize: '14px',
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: isLight
                ? 'rgba(59, 130, 246, 0.05)'
                : 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <p
              className="text-sm font-medium mb-2"
              style={{ color: colors.textSecondary }}
            >
              Allocation Summary
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {resourceFields.map((field) => (
                <div key={field.key} className="flex justify-between">
                  <span style={{ color: colors.textMuted }}>{field.label}:</span>
                  <span
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {(formData[field.key] || 0).toLocaleString()} {field.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: colors.buttonSecondary,
                color: colors.textPrimary,
                padding: '10px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: loading ? '#1d4ed8' : '#3b82f6',
                color: '#ffffff',
                padding: '10px 16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1,
              }}
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
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
  colors: PropTypes.object.isRequired,
  isLight: PropTypes.bool,
};

AllocationModal.defaultProps = {
  province: null,
  loading: false,
  isLight: false,
};

export default AllocationModal;
