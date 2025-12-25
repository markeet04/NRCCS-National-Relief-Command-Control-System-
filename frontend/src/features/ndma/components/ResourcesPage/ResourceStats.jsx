import PropTypes from 'prop-types';
import { Package, Truck, Box, Map } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';

/**
 * ResourceStats Component
 * Displays resource statistics in a responsive grid
 * Uses CSS classes from global-ndma.css and resource-allocation.css
 * Now includes colored left border with glow effect
 */
const ResourceStats = ({ stats }) => {
  const statCards = [
    {
      key: 'totalResources',
      label: 'Total Resources',
      value: stats.totalResources,
      unit: 'units',
      icon: Package,
      iconClass: 'ndma-stat-icon ndma-stat-icon-blue',
      borderClass: 'border-left-blue',
      glowClass: 'glow-blue',
    },
    {
      key: 'totalAllocated',
      label: 'Allocated',
      value: stats.totalAllocated,
      unit: 'distributed',
      icon: Truck,
      iconClass: 'ndma-stat-icon ndma-stat-icon-green',
      borderClass: 'border-left-green',
      glowClass: 'glow-green',
    },
    {
      key: 'totalAvailable',
      label: 'Available',
      value: stats.totalAvailable,
      unit: 'in stock',
      icon: Box,
      iconClass: 'ndma-stat-icon ndma-stat-icon-yellow',
      borderClass: 'border-left-yellow',
      glowClass: 'glow-yellow',
    },
    {
      key: 'provincesCount',
      label: 'Provinces Covered',
      value: stats.provincesCount,
      unit: 'regions',
      icon: Map,
      iconClass: 'ndma-stat-icon ndma-stat-icon-purple',
      borderClass: 'border-left-purple',
      glowClass: 'glow-purple',
    },
  ];

  return (
    <div className="resources-stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.key} 
            className={`ndma-card ndma-stat-card-glow resources-stat-card ${card.borderClass} ${card.glowClass}`}
          >
            {/* Header with icon and label */}
            <div className="resources-stat-header">
              <div className={card.iconClass}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="resources-stat-label">{card.label}</span>
            </div>
            
            {/* Value display with dark inner background */}
            <div className="ndma-card-inner resources-stat-value-container">
              <span className="resources-stat-value">
                {typeof card.value === 'number'
                  ? formatNumber(card.value)
                  : card.value}
              </span>
              <span className="resources-stat-unit">{card.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ResourceStats.propTypes = {
  stats: PropTypes.shape({
    totalResources: PropTypes.number.isRequired,
    totalAllocated: PropTypes.number.isRequired,
    totalAvailable: PropTypes.number.isRequired,
    provincesCount: PropTypes.number.isRequired,
    utilizationRate: PropTypes.number,
  }).isRequired,
};

export default ResourceStats;
