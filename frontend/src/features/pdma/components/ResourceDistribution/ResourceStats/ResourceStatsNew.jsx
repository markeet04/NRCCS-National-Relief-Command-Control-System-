import PropTypes from 'prop-types';
import { Package, Truck, Box, MapPin } from 'lucide-react';

/**
 * ResourceStatsNew Component
 * Displays resource statistics in a responsive grid with status cards
 * Similar design to NDMA ResourceStats with glowing borders
 */
const ResourceStatsNew = ({ totalResources, totalQuantity, allocatedPercent, availableQuantity, districtsCount = 0 }) => {
  const statCards = [
    {
      key: 'totalResources',
      label: 'Total Resources',
      value: totalResources,
      unit: 'Types',
      icon: Package,
      borderClass: 'border-left-blue',
      iconClass: 'icon-blue',
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      value: totalQuantity >= 1000 ? `${(totalQuantity / 1000).toFixed(1)}K` : totalQuantity,
      unit: 'Units',
      icon: Truck,
      borderClass: 'border-left-green',
      iconClass: 'icon-green',
    },
    {
      key: 'allocated',
      label: 'Allocated',
      value: `${allocatedPercent}%`,
      unit: 'Distributed',
      icon: Box,
      borderClass: 'border-left-yellow',
      iconClass: 'icon-yellow',
    },
    {
      key: 'available',
      label: 'Available',
      value: availableQuantity >= 1000 ? `${(availableQuantity / 1000).toFixed(1)}K` : availableQuantity,
      unit: 'In Stock',
      icon: MapPin,
      borderClass: 'border-left-purple',
      iconClass: 'icon-purple',
    },
  ];

  return (
    <div className="pdma-resource-stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.key} 
            className={`pdma-stat-card ${card.borderClass}`}
          >
            {/* Header with icon and label */}
            <div className="pdma-stat-header">
              <div className={`pdma-stat-icon ${card.iconClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="pdma-stat-label">{card.label}</span>
            </div>
            
            {/* Value display with dark inner background */}
            <div className="pdma-stat-value-container">
              <span className="pdma-stat-value">{card.value}</span>
              <span className="pdma-stat-unit">{card.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ResourceStatsNew.propTypes = {
  totalResources: PropTypes.number.isRequired,
  totalQuantity: PropTypes.number.isRequired,
  allocatedPercent: PropTypes.number.isRequired,
  availableQuantity: PropTypes.number.isRequired,
  districtsCount: PropTypes.number,
};

export default ResourceStatsNew;
