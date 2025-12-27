import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle, Clock, MapPin, User } from 'lucide-react';

/**
 * AlertCardItem Component
 * Individual alert card with badges, description, meta info, and actions
 */
const AlertCardItem = ({
  alert,
  onView,
  onResolve,
  onReopen,
  onDelete,
}) => {
  /**
   * Get status icon component based on alert status
   */
  const getStatusIcon = (status) => {
    if (status === 'resolved') return <CheckCircle className="w-4 h-4" />;
    if (status === 'pending') return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div
      className={`alert-card ${alert.severity} ${alert.status === 'resolved' ? 'resolved' : ''}`}
    >
      {/* Header with badges */}
      <div className="alert-card-header">
        <div className="alert-card-badges">
          <span className={`alert-severity-badge ${alert.severity}`}>
            {alert.severity}
          </span>
          {alert.type && (
            <span className="alert-type-badge">
              {alert.type}
            </span>
          )}
          <span className={`alert-status-badge ${alert.status}`}>
            {getStatusIcon(alert.status)}
            {alert.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="alert-card-title">{alert.title}</h3>

      {/* Description */}
      <p className="alert-card-description">{alert.description}</p>

      {/* Meta Info */}
      <div className="alert-card-meta">
        {alert.location && (
          <div className="alert-card-meta-item">
            <MapPin className="w-4 h-4" />
            <span className="alert-card-meta-label">Location:</span>
            <span className="alert-card-meta-value">{alert.location}</span>
          </div>
        )}
        {alert.source && (
          <div className="alert-card-meta-item">
            <User className="w-4 h-4" />
            <span className="alert-card-meta-label">Source:</span>
            <span className="alert-card-meta-value">{alert.source}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="alert-card-actions">
        <button
          className="alerts-btn alerts-btn-outline"
          onClick={() => onView(alert.id)}
        >
          View Details
        </button>

        {alert.status === 'resolved' ? (
          <>
            {/* Reopen button REMOVED per UI refinement - only Delete remains */}
            <button
              className="alerts-btn alerts-btn-danger"
              onClick={() => onDelete(alert.id)}
            >
              Delete
            </button>
          </>
        ) : (
          <button
            className="alerts-btn alerts-btn-success"
            onClick={() => onResolve(alert.id)}
          >
            <CheckCircle className="w-4 h-4" />
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

AlertCardItem.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    severity: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    source: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
  onReopen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AlertCardItem;
