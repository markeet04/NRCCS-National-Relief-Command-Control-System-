import PropTypes from 'prop-types';

/**
 * AlertsStatsGrid Component
 * Displays alert statistics in a 4-column grid
 * Uses CSS classes from nationwide-alerts.css for styling
 */
const AlertsStatsGrid = ({ stats }) => {
  const statCards = [
    { key: 'critical', label: 'Critical', value: stats.critical },
    { key: 'high', label: 'High', value: stats.high },
    { key: 'medium', label: 'Medium', value: stats.medium },
    { key: 'resolved', label: 'Resolved Today', value: stats.resolvedToday },
  ];

  return (
    <div className="alerts-stats-grid">
      {statCards.map((card) => (
        <div key={card.key} className={`alerts-stat-card ${card.key}`}>
          <div className={`alerts-stat-label ${card.key}`}>{card.label}</div>
          <div className={`alerts-stat-value ${card.key}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
};

AlertsStatsGrid.propTypes = {
  stats: PropTypes.shape({
    critical: PropTypes.number,
    high: PropTypes.number,
    medium: PropTypes.number,
    resolvedToday: PropTypes.number,
  }).isRequired,
};

export default AlertsStatsGrid;
