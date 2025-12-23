import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { UI_CONSTANTS } from '@config/constants';

/**
 * CreateAlertModal Component
 * Modal form for creating new alerts
 */
const CreateAlertModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onProvinceChange,
  onSubmit,
  loading,
  colors,
  isLight,
  validationErrors = {},
}) => {
  if (!isOpen) return null;

  const provinceDistrictsMap = UI_CONSTANTS.PROVINCE_DISTRICTS;
  const availableDistricts = formData.province
    ? provinceDistrictsMap[formData.province] || []
    : [];
  
  // Check if form has errors
  const hasErrors = Object.keys(validationErrors).length > 0;

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
          maxWidth: '500px',
          backgroundColor: colors.modalBg,
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: colors.textPrimary, margin: 0 }}
          >
            Create New Alert
          </h3>
          <button
            className="p-1.5 rounded transition-colors"
            style={{
              color: colors.textSecondary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onClose}
            aria-label="Close create alert modal"
            disabled={loading}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = isLight
                ? '#f1f5f9'
                : colors.elevatedBg)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              overflowY: 'auto',
              padding: '20px',
              flexGrow: 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Alert Title */}
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.textSecondary, marginBottom: '6px' }}
                >
                  Alert Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  className="w-full rounded-md"
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${validationErrors.title ? '#ef4444' : colors.border}`,
                    padding: '8px 12px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                  placeholder="e.g., Flash Flood Warning"
                  disabled={loading}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = validationErrors.title ? '#ef4444' : colors.border)}
                />
                {validationErrors.title && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {Array.isArray(validationErrors.title) ? validationErrors.title[0] : validationErrors.title}
                  </p>
                )}
              </div>

              {/* Severity Level */}
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.textSecondary, marginBottom: '6px' }}
                >
                  Severity Level <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={onChange}
                  required
                  className="w-full rounded-md"
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${validationErrors.severity ? '#ef4444' : colors.border}`,
                    padding: '8px 12px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  disabled={loading}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = validationErrors.severity ? '#ef4444' : colors.border)}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {validationErrors.severity && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {Array.isArray(validationErrors.severity) ? validationErrors.severity[0] : validationErrors.severity}
                  </p>
                )}
              </div>

              {/* Affected Provinces */}
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.textSecondary, marginBottom: '8px' }}
                >
                  Affected Provinces <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {validationErrors.province && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '8px' }}>
                    {Array.isArray(validationErrors.province) ? validationErrors.province[0] : validationErrors.province}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(provinceDistrictsMap).map((province) => (
                    <label
                      key={province}
                      className="flex items-center"
                      style={{
                        padding: '8px 10px',
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = colors.borderMedium)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = colors.border)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={formData.province === province}
                        onChange={(e) => onProvinceChange(province, e.target.checked)}
                        style={{
                          width: '16px',
                          height: '16px',
                          marginRight: '8px',
                          accentColor: '#3b82f6',
                          cursor: 'pointer',
                        }}
                        disabled={loading}
                      />
                      <span
                        style={{ color: colors.textPrimary, fontSize: '13px' }}
                      >
                        {province}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* District */}
              {formData.province && (
                <div>
                  <label
                    className="block text-sm font-medium"
                    style={{ color: colors.textSecondary, marginBottom: '6px' }}
                  >
                    District (Optional)
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={onChange}
                    className="w-full rounded-md"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.border}`,
                      padding: '8px 12px',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                    disabled={loading}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = colors.border)}
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Alert Message */}
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: colors.textSecondary, marginBottom: '6px' }}
                >
                  Alert Message <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  required
                  rows="3"
                  className="w-full rounded-md"
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.textPrimary,
                    border: `1px solid ${validationErrors.description ? '#ef4444' : colors.border}`,
                    padding: '8px 12px',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  placeholder="Detailed alert message..."
                  disabled={loading}
                  onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.target.style.borderColor = validationErrors.description ? '#ef4444' : colors.border)}
                />
                {validationErrors.description && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {Array.isArray(validationErrors.description) ? validationErrors.description[0] : validationErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}
          >
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-md font-medium transition-colors focus:outline-none"
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colors.buttonSecondaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.buttonSecondary)
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md font-medium transition-colors focus:outline-none"
                style={{
                  backgroundColor: loading ? '#dc2626' : '#ef4444',
                  color: '#ffffff',
                  padding: '10px 16px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
                onMouseEnter={(e) =>
                  !loading && (e.currentTarget.style.backgroundColor = '#dc2626')
                }
                onMouseLeave={(e) =>
                  !loading && (e.currentTarget.style.backgroundColor = '#ef4444')
                }
              >
                {loading ? 'Publishing...' : 'Publish Alert'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateAlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    severity: PropTypes.string,
    type: PropTypes.string,
    province: PropTypes.string,
    district: PropTypes.string,
    tehsil: PropTypes.string,
    source: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onProvinceChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  colors: PropTypes.object.isRequired,
  isLight: PropTypes.bool,
  validationErrors: PropTypes.object,
};

CreateAlertModal.defaultProps = {
  loading: false,
  isLight: false,
  validationErrors: {},
};

export default CreateAlertModal;
