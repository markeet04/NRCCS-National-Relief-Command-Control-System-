import PropTypes from 'prop-types';
import { StatCard } from '@shared/components/dashboard';

/**
 * StatisticsSection Component
 * Displays 6 stat cards in NDMA-style layout for PDMA Dashboard
 * Now using shared StatCard component with gradient styling
 */
const StatisticsSection = ({ stats }) => {
  // Map stat titles to gradientKeys for consistent colors
  const getGradientKey = (stat) => {
    const title = (stat.title || '').toLowerCase();
    if (title.includes('sos') || title.includes('pending')) return 'rose';
    if (title.includes('shelter')) return 'blue';
    if (title.includes('capacity') || title.includes('evacuee')) return 'violet';
    if (title.includes('rescue') || title.includes('team')) return 'emerald';
    if (title.includes('resource') || title.includes('local')) return 'amber';
    if (title.includes('damage') || title.includes('report')) return 'cyan';
    return 'blue'; // default
  };

  // Map stat titles to icon names
  const getIcon = (stat) => {
    const title = (stat.title || '').toLowerCase();
    if (title.includes('sos') || title.includes('pending')) return 'alert';
    if (title.includes('shelter')) return 'home';
    if (title.includes('capacity') || title.includes('evacuee')) return 'users';
    if (title.includes('rescue') || title.includes('team')) return 'truck';
    if (title.includes('resource') || title.includes('local')) return 'package';
    if (title.includes('damage') || title.includes('report')) return 'file';
    return 'package';
  };

  return (
    <div className="national-stats-grid" style={{ marginBottom: '24px' }}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={getIcon(stat)}
          gradientKey={getGradientKey(stat)}
          trendLabel={stat.subtitle || stat.trendLabel}
        />
      ))}
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
};

export default StatisticsSection;
