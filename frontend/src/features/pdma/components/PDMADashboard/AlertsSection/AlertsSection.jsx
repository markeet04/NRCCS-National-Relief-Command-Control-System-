import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { SEVERITY_BORDER_COLORS } from '../../../constants';

/**
 * AlertsSection Component
 * Shows all provincial alerts in a column layout for the sidebar
 */
const AlertsSection = ({ alerts, colors, isLight, showAllAlerts = false }) => {
  // Display all alerts
  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 5);

  // Get severity badge color
  const getSeverityColor = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    if (severityLower === 'critical') return '#ef4444';
    if (severityLower === 'high') return '#f97316';
    if (severityLower === 'medium') return '#eab308';
    return '#22c55e';
  };

  return (
    <div
      className="national-resource-card border-left-red"
      style={{
        background: colors.cardBg || '#0f1114',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header - Bolder */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${colors.border || '#1e293b'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: colors.textPrimary || '#fff',
            letterSpacing: '-0.01em',
          }}>
            Provincial Alerts
          </span>
        </div>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#ef4444',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '4px 10px',
          borderRadius: '6px',
        }}>
          {alerts.length} active
        </span>
      </div>

      {/* Alerts List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          maxHeight: '450px',
        }}
      >
        {displayedAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedAlerts.map((alert) => {
              const severityColor = SEVERITY_BORDER_COLORS[alert.severity] || getSeverityColor(alert.severity);

              return (
                <div
                  key={alert.id}
                  style={{
                    background: isLight ? '#f8fafc' : 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '8px',
                    padding: '14px',
                    borderLeft: `3px solid ${severityColor}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      color: colors.textPrimary || '#fff',
                      flex: 1,
                      lineHeight: '1.3',
                    }}>
                      {alert.title}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: `${severityColor}20`,
                        color: severityColor,
                        textTransform: 'uppercase',
                        marginLeft: '10px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: colors.textSecondary || '#94a3b8',
                    margin: '0 0 10px 0',
                    lineHeight: '1.5',
                  }}>
                    {alert.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: colors.textMuted || '#64748b',
                  }}>
                    <span>📍 {alert.location}</span>
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>{alert.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '40px 16px',
            textAlign: 'center',
            color: colors.textSecondary || '#94a3b8'
          }}>
            <AlertTriangle size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No active alerts</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
              All clear in your province
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

AlertsSection.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      severity: PropTypes.string,
      location: PropTypes.string,
      source: PropTypes.string,
    })
  ).isRequired,
  colors: PropTypes.object.isRequired,
  isLight: PropTypes.bool,
  showAllAlerts: PropTypes.bool,
};

export default AlertsSection;
