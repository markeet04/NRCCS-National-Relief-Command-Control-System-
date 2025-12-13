import { AlertTriangle, Plus } from 'lucide-react';
import { SEVERITY_BORDER_COLORS } from '../../../constants';

const AlertsSection = ({ alerts, colors, onCreateAlert, isLight }) => {
  return (
    <div 
      className="lg:col-span-3"
      style={{
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderLeft: !isLight ? '4px solid #ef4444' : `1px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div className="pdma-section-title" style={{ margin: 0 }}>
          <div
            className="pdma-section-title-icon"
            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
          >
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <h2 className="pdma-section-title-text">Provincial Alerts</h2>
        </div>
        <button 
          onClick={onCreateAlert}
          className="pdma-button pdma-button-primary pdma-button-small"
        >
          <Plus size={14} />
          Create
        </button>
      </div>

      <div
        style={{
          padding: '20px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
      >
        {alerts.map((alert) => {
          const severityBorderColor = SEVERITY_BORDER_COLORS[alert.severity] || '#f59e0b';

          return (
            <div
              key={alert.id}
              className="pdma-alert-item"
              style={{
                background: colors.cardBg,
                borderColor: severityBorderColor,
                borderLeftColor: severityBorderColor,
                borderBottomColor: colors.border,
                borderRightColor: colors.border,
                borderTopColor: colors.border
              }}
            >
              <div className="pdma-alert-item-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pdma-alert-item-title" style={{ color: colors.textPrimary }}>
                    {alert.title}
                  </div>
                  <div className="pdma-alert-item-description" style={{ color: colors.textSecondary }}>
                    {alert.description}
                  </div>
                </div>
                <span className={`pdma-badge pdma-badge-${alert.severity}`}>
                  {alert.severity}
                </span>
              </div>
              <div
                className="pdma-alert-item-footer"
                style={{
                  borderTopColor: colors.border,
                  color: colors.textMuted
                }}
              >
                <span>📍 {alert.location}</span>
                <span>{alert.source}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsSection;
