import PropTypes from 'prop-types';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * AlertDetailsModal Component
 * Modal for viewing detailed alert information
 */
const AlertDetailsModal = ({ alert, onClose, onResolve }) => {
  if (!alert) return null;

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
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.75)', zIndex: 9999 }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-tertiary)',
            zIndex: 10,
            padding: '24px 32px',
          }}
        >
          <div>
            <h3
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)', marginBottom: '4px' }}
            >
              Alert Details
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Full alert information
            </p>
          </div>
          <button
            className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(148, 163, 184, 0.12)',
            }}
            onClick={onClose}
            aria-label="Close alert details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Title and Badges */}
          <div style={{ marginBottom: '32px' }}>
            <h4
              className="text-2xl font-bold"
              style={{
                color: 'var(--text-primary)',
                marginBottom: '20px',
                lineHeight: '1.3',
                fontSize: '2.2rem',
              }}
            >
              {alert.title}
            </h4>
            <div className="flex flex-wrap gap-3">
              <span
                className="px-4 py-2 rounded-lg text-xs font-semibold uppercase"
                style={{
                  backgroundColor: severityStyle.bg,
                  color: severityStyle.color,
                  border: `1px solid ${severityStyle.border}`,
                  letterSpacing: '0.05em',
                  fontSize: '1.1rem',
                }}
              >
                {alert.severity}
              </span>
              <span
                className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  fontSize: '1.1rem',
                }}
              >
                {alert.status === 'active' && (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {alert.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Description */}
            <div
              className="rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px 24px' }}
            >
              <h5
                className="text-xs font-semibold"
                style={{
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}
              >
                Description
              </h5>
              <p
                style={{
                  color: 'var(--text-primary)',
                  lineHeight: '1.8',
                  fontSize: '15px',
                }}
              >
                {alert.description}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '16px' }}>
              {alert.type && (
                <InfoCard label="Alert Type" value={alert.type} />
              )}
              {alert.location && (
                <InfoCard label="Location" value={alert.location} />
              )}
              {alert.source && (
                <InfoCard label="Source" value={alert.source} />
              )}
              <InfoCard label="Alert ID" value={`#${alert.id}`} isMonospace />
            </div>

            {/* Active Alert Warning */}
            {alert.status === 'active' && (
              <div
                className="rounded-lg"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '20px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <h5
                      className="text-sm font-semibold"
                      style={{ color: '#ef4444', marginBottom: '8px' }}
                    >
                      Active Alert
                    </h5>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}
                    >
                      This alert is currently active and requires attention.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col md:flex-row"
            style={{
              gap: '12px',
              paddingTop: '24px',
              marginTop: '24px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <button
              className="w-full md:w-auto rounded-lg font-medium transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'rgba(148, 163, 184, 0.12)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                padding: '12px 24px',
              }}
              onClick={onClose}
            >
              Close
            </button>
            {alert.status === 'active' && onResolve && (
              <button
                className="w-full md:flex-1 rounded-lg font-semibold flex items-center justify-center transition-colors hover:bg-opacity-90"
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  gap: '8px',
                  padding: '12px 24px',
                }}
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
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

/**
 * InfoCard Component
 * Displays a single piece of information
 */
const InfoCard = ({ label, value, isMonospace }) => (
  <div
    className="rounded-lg"
    style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px 20px' }}
  >
    <h5
      className="text-xs font-semibold"
      style={{
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '10px',
      }}
    >
      {label}
    </h5>
    <p
      className={`font-medium ${isMonospace ? 'font-mono' : ''}`}
      style={{ color: 'var(--text-primary)', fontSize: '15px' }}
    >
      {value}
    </p>
  </div>
);

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isMonospace: PropTypes.bool,
};

InfoCard.defaultProps = {
  isMonospace: false,
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
};

AlertDetailsModal.defaultProps = {
  alert: null,
  onResolve: null,
};

export default AlertDetailsModal;
