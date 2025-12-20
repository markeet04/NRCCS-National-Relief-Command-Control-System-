import PropTypes from 'prop-types';
import { Package, Truck, Box, Map } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';

/**
 * ResourceStats Component
 * Displays resource statistics in a responsive grid
 */
const ResourceStats = ({ stats, isLight }) => {
  const statCards = [
    {
      key: 'totalResources',
      label: 'Total Resources',
      value: stats.totalResources,
      icon: Package,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      key: 'totalAllocated',
      label: 'Allocated',
      value: stats.totalAllocated,
      icon: Truck,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      key: 'totalAvailable',
      label: 'Available',
      value: stats.totalAvailable,
      icon: Box,
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.1)',
    },
    {
      key: 'provincesCount',
      label: 'Provinces Covered',
      value: stats.provincesCount,
      icon: Map,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {card.label}
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {typeof card.value === 'number'
                    ? formatNumber(card.value)
                    : card.value}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: card.bgColor }}
              >
                <Icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
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
  isLight: PropTypes.bool,
};

ResourceStats.defaultProps = {
  isLight: false,
};

export default ResourceStats;
