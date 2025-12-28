import PropTypes from 'prop-types';
import { StatCard } from '@shared/components/dashboard';

/**
 * AlertsStatsGrid Component
 * Displays alert statistics in a 4-column grid
 * Now using shared StatCard component with gradient styling
 */
const AlertsStatsGrid = ({ stats }) => {
  const statCards = [
    {
      title: 'CRITICAL',
      value: stats.critical,
      gradientKey: 'rose',
      icon: 'alert'
    },
    {
      title: 'HIGH',
      value: stats.high,
      gradientKey: 'amber',
      icon: 'alert'
    },
    {
      title: 'MEDIUM',
      value: stats.medium,
      gradientKey: 'blue',
      icon: 'bell'
    },
    {
      title: 'RESOLVED TODAY',
      value: stats.resolvedToday,
      gradientKey: 'emerald',
      icon: 'shield'
    },
  ];

  return (
    <div className="alerts-stats-grid">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          gradientKey={card.gradientKey}
        />
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
