const AlertItem = ({ alert }) => {
  return (
    <div className={`alert-item ${alert.type}`}>
      <div className="alert-header-row">
        <div style={{ flex: 1 }}>
          <h3>{alert.title}</h3>
          <p>{alert.message}</p>
          <span className="alert-time">{alert.time}</span>
        </div>
        {alert.type === 'warning' && (
          <span className="priority-badge">HIGH PRIORITY</span>
        )}
      </div>
    </div>
  );
};

export default AlertItem;
