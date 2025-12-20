import PropTypes from 'prop-types';
import { StatCard } from '@shared/components/dashboard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsOverview Component
 * Displays dashboard statistics in a responsive grid layout
 */
const StatsOverview = ({ stats, isLight }) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return '#ef4444'; // Red for increasing disasters
      case 'down':
        return '#22c55e'; // Green for decreasing
      default:
        return '#94a3b8'; // Gray for stable
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          color={stat.color}
          icon={stat.icon}
          isLight={isLight}
        />
      ))}
    </div>
  );
};

StatsOverview.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.string,
      trend: PropTypes.oneOf(['up', 'down', 'stable']),
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ).isRequired,
  isLight: PropTypes.bool,
};

StatsOverview.defaultProps = {
  isLight: false,
};

export default StatsOverview;
