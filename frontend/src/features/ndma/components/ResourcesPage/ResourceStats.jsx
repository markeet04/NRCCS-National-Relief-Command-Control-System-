import PropTypes from 'prop-types';
import { Package, Truck, Box, Map } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import '@styles/css/main.css';

/**
 * ResourceStats Component
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 * Uses unified stat-card CSS classes for consistency
 */
const ResourceStats = ({ stats }) => {
  const statCards = [
    {
      key: 'totalResources',
      label: 'Total Resources',
      value: stats.totalResources,
      unit: 'units',
      icon: Package,
      colorClass: 'green',
    },
    {
      key: 'totalAllocated',
      label: 'Allocated',
      value: stats.totalAllocated,
      unit: 'distributed',
      icon: Truck,
      colorClass: 'amber',
    },
    {
      key: 'totalAvailable',
      label: 'Available',
      value: stats.totalAvailable,
      unit: 'in stock',
      icon: Box,
      colorClass: 'cyan',
    },
    {
      key: 'provincesCount',
      label: 'Provinces Covered',
      value: stats.provincesCount,
      unit: 'regions',
      icon: Map,
      colorClass: 'purple',
    },
  ];

  return (
    <div className="district-stats-grid">
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
            <div className="stat-card__value">
              {typeof card.value === 'number'
                ? formatNumber(card.value)
                : card.value}
            </div>

            {/* Subtitle */}
            <span className="stat-card__subtitle">
              {card.unit}
            </span>
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
