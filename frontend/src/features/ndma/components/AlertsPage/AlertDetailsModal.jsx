import PropTypes from 'prop-types';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

// Default dark theme colors (fallback)
const DEFAULT_COLORS = {
  modalBg: '#0f1114',
  elevatedBg: '#151719',
  inputBg: '#1a1d21',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  border: '#2d3238',
};

/**
 * AlertDetailsModal Component
 * Modal for viewing detailed alert information
 */
const AlertDetailsModal = ({ alert, onClose, onResolve, colors: propColors, isLight = false }) => {
  if (!alert) return null;

  // Use provided colors or fall back to defaults
  const colors = propColors || DEFAULT_COLORS;

  const getSeverityStyle = (severity) => {
    const styles = {
      critical: {
        bg: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.3)',
      },
      high: {
        bg: 'rgba(249, 115, 22, 0.15)',
        color: '#f97316',
        border: 'rgba(249, 115, 22, 0.3)',
      },
      medium: {
        bg: 'rgba(245, 158, 11, 0.15)',
        color: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      low: {
        bg: 'rgba(59, 130, 246, 0.15)',
        color: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.3)',
      },
    };
    return styles[severity] || styles.low;
  };

  const getStatusStyle = (status) => {
    const styles = {
      active: {
        bg: 'rgba(59, 130, 246, 0.15)',
        color: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.3)',
      },
      resolved: {
        bg: 'rgba(16, 185, 129, 0.15)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)',
      },
    };
    return styles[status] || styles.active;
  };

  const severityStyle = getSeverityStyle(alert.severity);
  const statusStyle = getStatusStyle(alert.status);

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
          maxWidth: '600px',
          backgroundColor: colors.modalBg || colors.cardBg,
          borderRadius: '12px',
          boxShadow: isLight 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: isLight ? `1px solid ${colors.border}` : 'none',
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
            Alert Details
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
            aria-label="Close alert details"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = isLight ? '#f1f5f9' : (colors.elevatedBg || '#151719'))
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '16px 20px',
            flexGrow: 1,
          }}
        >
          {/* Title and Badges */}
          <div className="alert-details-title-section">
            <h4
              className="text-lg font-semibold alert-details-title"
              style={{
                color: colors.textPrimary,
              }}
            >
              {alert.title}
            </h4>
            <div className="alert-details-badges">
              <span
                className="alert-badge alert-badge-severity"
                style={{
                  backgroundColor: severityStyle.bg,
                  color: severityStyle.color,
                  border: `1px solid ${severityStyle.border}`,
                }}
              >
                {alert.severity}
              </span>
              <span
                className="alert-badge alert-badge-status"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                }}
              >
                {alert.status === 'active' && (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {alert.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="alert-details-fields">
            {/* Description */}
            <div className="alert-details-field">
              <label
                className="alert-details-label"
                style={{ color: colors.textSecondary }}
              >
                Description
              </label>
              <div
                className="alert-details-value"
                style={{
                  backgroundColor: colors.inputBg || (isLight ? '#f8fafc' : '#1a1d21'),
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p
                  style={{
                    color: colors.textPrimary,
                    lineHeight: '1.6',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  {alert.description}
                </p>
              </div>
            </div>

            {/* Type */}
            {alert.type && (
              <div className="alert-details-field">
                <label
                  className="alert-details-label"
                  style={{ color: colors.textSecondary }}
                >
                  Alert Type
                </label>
                <div
                  className="alert-details-value"
                  style={{
                    backgroundColor: colors.inputBg || (isLight ? '#f8fafc' : '#1a1d21'),
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <p style={{ color: colors.textPrimary, fontSize: '14px', margin: 0 }}>
                    {alert.type}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {alert.location && (
              <div className="alert-details-field">
                <label
                  className="alert-details-label"
                  style={{ color: colors.textSecondary }}
                >
                  Location
                </label>
                <div
                  className="alert-details-value"
                  style={{
                    backgroundColor: colors.inputBg || (isLight ? '#f8fafc' : '#1a1d21'),
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <p style={{ color: colors.textPrimary, fontSize: '14px', margin: 0 }}>
                    {alert.location}
                  </p>
                </div>
              </div>
            )}

            {/* Source */}
            {alert.source && (
              <div className="alert-details-field">
                <label
                  className="alert-details-label"
                  style={{ color: colors.textSecondary }}
                >
                  Source
                </label>
                <div
                  className="alert-details-value"
                  style={{
                    backgroundColor: colors.inputBg || (isLight ? '#f8fafc' : '#1a1d21'),
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <p style={{ color: colors.textPrimary, fontSize: '14px', margin: 0 }}>
                    {alert.source}
                  </p>
                </div>
              </div>
            )}

            {/* Active Alert Warning */}
            {alert.status === 'active' && (
              <div
                className="alert-details-warning"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertTriangle
                    className="w-4 h-4"
                    style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <h5
                      className="text-sm font-semibold"
                      style={{ color: '#ef4444', marginBottom: '4px', margin: 0 }}
                    >
                      Active Alert
                    </h5>
                    <p
                      className="text-xs"
                      style={{ color: colors.textSecondary, lineHeight: '1.5', margin: 0 }}
                    >
                      This alert is currently active and requires attention.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                backgroundColor: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.12)',
                color: colors.textPrimary,
                padding: '10px 16px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              onClick={onClose}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.2)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.12)')
              }
            >
              Close
            </button>
            {alert.status === 'active' && onResolve && (
              <button
                type="button"
                className="flex-1 rounded-md font-medium transition-colors focus:outline-none flex items-center justify-center"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  gap: '6px',
                  padding: '10px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#059669')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#10b981')
                }
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AlertDetailsModal.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    severity: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    source: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onResolve: PropTypes.func,
  colors: PropTypes.object,
  isLight: PropTypes.bool,
};

AlertDetailsModal.defaultProps = {
  alert: null,
  onResolve: null,
  colors: null,
  isLight: false,
};

export default AlertDetailsModal;
