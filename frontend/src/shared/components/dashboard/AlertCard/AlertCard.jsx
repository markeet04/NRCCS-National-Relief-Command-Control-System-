import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { UI_CONSTANTS } from '@config/constants';
import { getSeverityColor, getStatusColor } from '@utils/colorUtils';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

/**
 * AlertCard Component
 * Displays alert/notification with severity badge and actions
 * @param {Object} props - Component props
 * @param {string} props.title - Alert title
 * @param {string} props.description - Alert description
 * @param {string} props.severity - Alert severity (critical, high, medium, low)
 * @param {string} props.status - Alert status (active, resolved, pending)
 * @param {string} props.type - Alert type
 * @param {string} props.location - Alert location
 * @param {string} props.source - Alert source (NDMA, PDMA, etc.)
 * @param {Function} props.onResolve - Resolve action handler
 * @param {Function} props.onView - View details handler
 */
const AlertCard = ({
  title,
  description,
  severity = 'medium',
  status = 'active',
  type,
  location,
  source,
  onResolve,
  onReopen,
  onDelete,
  onView,
  showSeverityBadge = false
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  const severityColor = getSeverityColor(severity);
  const statusColor = getStatusColor(status);

  // Get severity-based styling for light mode
  const getSeverityStyle = () => {
    if (!isLight) return { bg: colors.cardBg, border: colors.cardBorder, accentLine: '#ef4444' };
    
    const styles = {
      critical: { 
        bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', 
        border: '#fecaca',
        accentLine: '#dc2626'
      },
      high: { 
        bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', 
        border: '#fed7aa',
        accentLine: '#ea580c'
      },
      medium: { 
        bg: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', 
        border: '#fde047',
        accentLine: '#ca8a04'
      },
      low: { 
        bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
        border: '#bbf7d0',
        accentLine: '#16a34a'
      }
    };
    return styles[severity] || styles.medium;
  };
  
  const severityStyle = getSeverityStyle();

  const getStatusIcon = () => {
    const icons = {
      active: <AlertTriangle className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
    };
    return icons[status] || icons.active;
  };

  return (
    <div 
      className="rounded-xl transition-all duration-300 hover:scale-[1.01]" 
      style={{ 
        background: isLight ? severityStyle.bg : colors.cardBg, 
        border: `1px solid ${isLight ? severityStyle.border : colors.cardBorder}`, 
        borderLeft: `4px solid ${severityStyle.accentLine}`,
        padding: '20px', 
        boxShadow: isLight ? `0 4px 20px ${severityStyle.accentLine}15` : 'none',
        margin: '0' 
      }}
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          <AlertTriangle style={{ width: '22px', height: '22px', color: severityStyle.accentLine }} />
          <div className="flex flex-wrap gap-2">
            {showSeverityBadge && (
              <span
                className="text-xs font-semibold uppercase"
                style={{
                  backgroundColor: severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : severity === 'medium' ? '#ca8a04' : '#16a34a',
                  color: '#fff',
                  letterSpacing: '0.05em',
                  padding: '5px 14px',
                  borderRadius: '16px',
                  fontWeight: 600,
                  marginRight: '6px',
                  textTransform: 'lowercase',
                  fontSize: '0.95em'
                }}
              >
                {severity}
              </span>
            )}
            <span
              className="text-xs font-medium flex items-center"
              style={{
                backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'var(--bg-secondary)',
                color: colors.textSecondary,
                border: `1px solid ${isLight ? severityStyle.border : colors.cardBorder}`,
                padding: '5px 14px',
                gap: '8px',
                borderRadius: '16px',
                fontWeight: 500,
                fontSize: '0.95em'
              }}
            >
              {getStatusIcon()}
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold mb-4" style={{ color: colors.textPrimary, fontSize: '18px' }}>{title}</h3>
      
      {/* Description */}
      <p className="mb-6" style={{ color: colors.textMuted, lineHeight: '1.7', fontSize: '15px' }}>{description}</p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-5 mb-6" style={{ color: colors.textSecondary, fontSize: '14px' }}>
        {type && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Type:</span>
            <span className="font-medium" style={{ color: colors.textSecondary }}>{type}</span>
          </div>
        )}
        {location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Location:</span>
            <span className="font-medium" style={{ color: colors.textSecondary }}>{location}</span>
          </div>
        )}
        {source && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>By:</span>
            <span className="font-medium" style={{ color: colors.textSecondary }}>{source}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onResolve || onReopen || onDelete || onView) && (
        <div className="flex gap-2 mt-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          {onView && (
            <button
              onClick={onView}
              className="flex-1 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                color: '#0284c7', 
                backgroundColor: isLight ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)', 
                fontSize: '0.875rem', 
                padding: '10px 16px', 
                minHeight: '40px',
                boxShadow: isLight ? '0 2px 8px rgba(14, 165, 233, 0.2)' : 'none'
              }}
            >
              View Details
            </button>
          )}
          {status === 'resolved' && onReopen && (
            <button
              onClick={onReopen}
              className="flex-1 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{
                color: '#ffffff',
                backgroundColor: '#f59e0b',
                fontSize: '0.875rem',
                padding: '10px 16px',
                minHeight: '40px',
                boxShadow: isLight ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none'
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px' }} />
              Reopen
            </button>
          )}
          {status === 'resolved' && onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{
                color: '#ffffff',
                backgroundColor: '#ef4444',
                fontSize: '0.875rem',
                padding: '10px 16px',
                minHeight: '40px'
              }}
            >
              Delete
            </button>
          )}
          {status !== 'resolved' && onResolve && (
            <button
              onClick={onResolve}
              className="flex-1 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{
                color: '#ffffff',
                backgroundColor: '#10b981',
                fontSize: '0.875rem',
                padding: '10px 16px',
                minHeight: '40px'
              }}
            >
              Delete
            </button>
          )}
          {status !== 'resolved' && onResolve && (
            <button
              onClick={onResolve}
              className="flex-1 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1.5"
              style={{
                color: '#ffffff',
                backgroundColor: '#059669',
                fontSize: '0.875rem',
                padding: '10px 16px',
                minHeight: '40px',
                boxShadow: isLight ? '0 4px 12px rgba(5, 150, 105, 0.35)' : 'none'
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px' }} />
              Resolve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

AlertCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['critical', 'high', 'medium', 'low']),
  status: PropTypes.oneOf(['active', 'resolved', 'pending']),
  type: PropTypes.string,
  location: PropTypes.string,
  source: PropTypes.string,
  onResolve: PropTypes.func,
  onReopen: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};

export default AlertCard;
