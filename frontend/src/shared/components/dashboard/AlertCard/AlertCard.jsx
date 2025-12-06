import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { UI_CONSTANTS } from '@config/constants';
import { getSeverityColor, getStatusColor } from '@utils/colorUtils';

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
  const severityColor = getSeverityColor(severity);
  const statusColor = getStatusColor(status);

  const getStatusIcon = () => {
    const icons = {
      active: <AlertTriangle className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
    };
    return icons[status] || icons.active;
  };

  return (
    <div className="rounded-lg transition-all duration-200" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '20px', boxShadow: 'var(--card-shadow)', margin: '0' }}>
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">
          <AlertTriangle style={{ width: '22px', height: '22px', color: '#a3e635' }} />
          <div className="flex flex-wrap gap-2">
            {showSeverityBadge && (
              <span
                className="text-xs font-semibold uppercase"
                style={{
                  backgroundColor: severity === 'critical' ? '#b91c1c' : severity === 'high' ? '#c2410c' : severity === 'medium' ? '#ca8a04' : '#16a34a',
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
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
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
      <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontSize: '18px' }}>{title}</h3>
      
      {/* Description */}
      <p className="mb-6" style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px' }}>{description}</p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-5 mb-6" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        {type && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Type:</span>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{type}</span>
          </div>
        )}
        {location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Location:</span>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{location}</span>
          </div>
        )}
        {source && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>By:</span>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{source}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onResolve || onReopen || onDelete || onView) && (
        <div className="flex gap-2 mt-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          {onView && (
            <button
              onClick={onView}
              className="flex-1 font-medium rounded-lg transition-colors"
              style={{ color: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', fontSize: '0.875rem', padding: '10px 16px', minHeight: '40px' }}
            >
              View Details
            </button>
          )}
          {status === 'resolved' && onReopen && (
            <button
              onClick={onReopen}
              className="flex-1 font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              style={{
                color: '#ffffff',
                backgroundColor: '#f59e0b',
                fontSize: '0.875rem',
                padding: '10px 16px',
                minHeight: '40px'
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
