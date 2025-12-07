const AlertDetails = ({ alert }) => {
  return (
    <div className="alert-details">
      <div className="detail-section">
        <h4>Full Description</h4>
        <p>{alert.fullDescription}</p>
      </div>

      <div className="detail-section">
        <h4>Affected Areas</h4>
        <div className="areas-list">
          {alert.affectedAreas.map((area, idx) => (
            <span key={idx} className="area-tag">
              📍 {area}
            </span>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h4>Recommended Actions</h4>
        <ul className="actions-list">
          {alert.recommendedActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>

      <div className="alert-id">
        Alert ID: <strong>{alert.id}</strong>
      </div>
    </div>
  );
};

export default AlertDetails;
