const QuickActionCard = ({ action, icon, onClick }) => {
  return (
    <div
      className={`action-card ${action.gradient}`}
      onClick={onClick}
    >
      <div className={`action-icon ${action.gradient}`}>
        {icon}
      </div>
      <div className="action-content">
        <h3>{action.title}</h3>
        <p>{action.description}</p>
      </div>
      <span className="action-arrow">→</span>
    </div>
  );
};

export default QuickActionCard;
