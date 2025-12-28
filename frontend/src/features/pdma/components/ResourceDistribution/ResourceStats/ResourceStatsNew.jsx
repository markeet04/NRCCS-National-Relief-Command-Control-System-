import PropTypes from 'prop-types';
import { Package, Truck, Box, MapPin } from 'lucide-react';
import '@styles/css/main.css';

/**
 * ResourceStatsNew Component
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */
const ResourceStatsNew = ({ totalResources, totalQuantity, allocatedPercent, availableQuantity, districtsCount = 0 }) => {
  const statCards = [
    {
      key: 'totalResources',
      label: 'Total Resources',
      value: totalResources,
      unit: 'Types',
      icon: Package,
      colorClass: 'blue',
    },
    {
      key: 'totalQuantity',
      label: 'Total Quantity',
      value: totalQuantity >= 1000 ? `${(totalQuantity / 1000).toFixed(1)}K` : totalQuantity,
      unit: 'Units',
      icon: Truck,
      colorClass: 'green',
    },
    {
      key: 'allocated',
      label: 'Allocated',
      value: `${allocatedPercent}%`,
      unit: 'Distributed',
      icon: Box,
      colorClass: 'amber',
    },
    {
      key: 'available',
      label: 'Available',
      value: availableQuantity >= 1000 ? `${(availableQuantity / 1000).toFixed(1)}K` : availableQuantity,
      unit: 'In Stock',
      icon: MapPin,
      colorClass: 'purple',
    },
  ];

  return (
    <div className="national-stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`stat-card stat-card--${card.colorClass}`}
          >
            {/* Header: Title LEFT, Icon RIGHT */}
            <div className="stat-card__header">
              <span className="stat-card__title">{card.label}</span>
              <div className={`stat-card__icon stat-card__icon--${card.colorClass}`}>
                <Icon size={20} />
              </div>
            </div>

            {/* Value */}
            <div className="stat-card__value">{card.value}</div>

            {/* Subtitle */}
            <span className="stat-card__subtitle">{card.unit}</span>
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
