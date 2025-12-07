import AlertCard from './AlertCard';

const AlertsList = ({ 
  alerts, 
  expandedId, 
  onToggleExpand, 
  onMarkAsRead,
  getSeverityConfig,
  formatTimestamp 
}) => {
  return (
    <div className="alerts-list">
      {alerts.map((alert, index) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          index={index}
          isExpanded={expandedId === alert.id}
          onToggleExpand={onToggleExpand}
          onMarkAsRead={onMarkAsRead}
          config={getSeverityConfig(alert.severity)}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );
};

export default AlertsList;
