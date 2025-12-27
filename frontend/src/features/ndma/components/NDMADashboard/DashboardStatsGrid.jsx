import PropTypes from 'prop-types';
import {
  AlertTriangle,
  Truck,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

/**
 * DashboardStatsGrid Component
 * Displays the 4 stat cards in a grid layout for NDMA Dashboard
 * Uses CSS classes from national-dashboard.css
 */
const DashboardStatsGrid = ({ stats, loading }) => {
  // Icon mapping
  const iconMap = {
    emergencies: AlertTriangle,
    teams: Truck,
    evacuated: Users,
    resources: Package,
  };

  // Border class mapping
  const borderClassMap = {
    emergencies: 'border-left-red',
    teams: 'border-left-blue',
    evacuated: 'border-left-green',
    resources: 'border-left-purple',
  };

  return (
    <div className="national-stats-grid">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconClass] || Package;
        const borderClass = borderClassMap[stat.iconClass] || '';

        return (
          <div key={index} className={`national-stat-card ${borderClass}`}>
            <div className="national-stat-card-header">
              <span className="national-stat-card-label">{stat.title}</span>
              <div className={`national-stat-card-icon ${stat.iconClass}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <div className="national-stat-card-value">
              {loading ? '...' : stat.value}
            </div>
            {stat.trend !== null ? (
              <div className={`national-stat-card-trend ${stat.trendDirection}`}>
                {stat.trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.trend}% {stat.trendLabel}
              </div>
            ) : (
              <div className="national-stat-card-trend neutral">
                {stat.trendLabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

DashboardStatsGrid.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      trend: PropTypes.number,
      trendDirection: PropTypes.oneOf(['up', 'down', null]),
      trendLabel: PropTypes.string,
      iconClass: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

DashboardStatsGrid.defaultProps = {
  loading: false,
};

export default DashboardStatsGrid;
