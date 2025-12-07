import AlertDetails from './AlertDetails';

const AlertCard = ({
  alert,
  index,
  isExpanded,
  onToggleExpand,
  onMarkAsRead,
  config,
  formatTimestamp,
}) => {
  return (
    <div
      className={`alert-card ${alert.isRead ? 'read' : 'unread'} ${isExpanded ? 'expanded' : ''}`}
      style={{
        animationDelay: `${index * 0.05}s`,
        borderLeftColor: config.color,
      }}
    >
      {!alert.isRead && <div className="unread-indicator"></div>}

      <div className="alert-main">
        <div
          className="alert-severity"
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
          }}
        >
          <span className="severity-icon">{config.icon}</span>
          <span className="severity-label" style={{ color: config.color }}>
            {alert.severity}
          </span>
        </div>

        <div className="alert-content">
          <div className="alert-header">
            <h3>{alert.title}</h3>
            <span className="alert-timestamp">
              {formatTimestamp(alert.timestamp)}
            </span>
          </div>

          <p className="alert-brief">{alert.briefDescription}</p>

          <div className="alert-actions">
            <button
              className="action-btn expand-btn"
              onClick={() => onToggleExpand(alert.id)}
            >
              {isExpanded ? '▲ Show Less' : '▼ Read More'}
            </button>
            {!alert.isRead && (
              <button
                className="action-btn mark-read-btn"
                onClick={() => onMarkAsRead(alert.id)}
              >
                ✓ Mark as Read
              </button>
            )}
          </div>

          {isExpanded && <AlertDetails alert={alert} />}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
