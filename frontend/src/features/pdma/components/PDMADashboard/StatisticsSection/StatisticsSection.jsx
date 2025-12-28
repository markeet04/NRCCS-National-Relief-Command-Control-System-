import PropTypes from 'prop-types';
import {
  AlertTriangle,
  Home,
  Users,
  Package,
  Truck,
  ClipboardList,
} from 'lucide-react';

/**
 * StatisticsSection Component
 * Displays 6 stat cards in NDMA-style layout for PDMA Dashboard
 * Uses national-dashboard.css card styling
 */
const StatisticsSection = ({ stats, colors }) => {
  // Icon mapping based on stat title/type
  const getIcon = (stat) => {
    const title = (stat.title || '').toLowerCase();
    if (title.includes('sos') || title.includes('pending')) return AlertTriangle;
    if (title.includes('shelter')) return Home;
    if (title.includes('capacity') || title.includes('evacuee')) return Users;
    if (title.includes('rescue') || title.includes('team')) return Truck;
    if (title.includes('resource') || title.includes('local')) return Package;
    if (title.includes('damage') || title.includes('report')) return ClipboardList;
    return Package;
  };

  // Get border color class based on index or stat type
  const getBorderClass = (index, stat) => {
    const title = (stat.title || '').toLowerCase();
    if (title.includes('sos') || title.includes('pending')) return 'border-left-red';
    if (title.includes('shelter')) return 'border-left-blue';
    if (title.includes('capacity') || title.includes('evacuee')) return 'border-left-cyan';
    if (title.includes('rescue') || title.includes('team')) return 'border-left-purple';
    if (title.includes('resource') || title.includes('local')) return 'border-left-green';
    if (title.includes('damage') || title.includes('report')) return 'border-left-orange';

    // Fallback based on index
    const classes = ['border-left-red', 'border-left-blue', 'border-left-cyan', 'border-left-purple', 'border-left-green', 'border-left-orange'];
    return classes[index % classes.length];
  };

  // Get icon class for coloring
  const getIconClass = (index, stat) => {
    const title = (stat.title || '').toLowerCase();
    if (title.includes('sos') || title.includes('pending')) return 'emergencies';
    if (title.includes('shelter')) return 'teams';
    if (title.includes('capacity') || title.includes('evacuee')) return 'evacuated';
    if (title.includes('rescue') || title.includes('team')) return 'resources';
    if (title.includes('resource') || title.includes('local')) return 'evacuated';
    if (title.includes('damage') || title.includes('report')) return 'teams';

    const iconClasses = ['emergencies', 'teams', 'evacuated', 'resources'];
    return iconClasses[index % iconClasses.length];
  };

  return (
    <div className="national-stats-grid" style={{ marginBottom: '24px' }}>
      {stats.map((stat, index) => {
        const IconComponent = getIcon(stat);
        const borderClass = getBorderClass(index, stat);
        const iconClass = getIconClass(index, stat);

        return (
          <div key={index} className={`national-stat-card ${borderClass}`}>
            <div className="national-stat-card-header">
              <span className="national-stat-card-label">{stat.title}</span>
              <div className={`national-stat-card-icon ${iconClass}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            <div className="national-stat-card-value">
              {stat.value}
            </div>
            <div className="national-stat-card-trend neutral">
              {stat.subtitle || stat.trendLabel || 'Provincial Data'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

StatisticsSection.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      subtitle: PropTypes.string,
      trendLabel: PropTypes.string,
    })
  ).isRequired,
  colors: PropTypes.object,
};

export default StatisticsSection;
