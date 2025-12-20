import PropTypes from 'prop-types';
import { MapPin, Users, AlertTriangle, Droplets } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';

/**
 * ProvinceStatusCard Component
 * Displays province flood status with key metrics
 */
const ProvinceStatusCard = ({ province, onClick, isSelected, isLight }) => {
  const getStatusColors = (status) => {
    const colors = {
      critical: {
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
        text: '#ef4444',
        badge: '#ef4444',
      },
      warning: {
        bg: 'rgba(249, 115, 22, 0.1)',
        border: 'rgba(249, 115, 22, 0.3)',
        text: '#f97316',
        badge: '#f97316',
      },
      normal: {
        bg: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.3)',
        text: '#22c55e',
        badge: '#22c55e',
      },
    };
    return colors[status] || colors.normal;
  };

  const statusColors = getStatusColors(province.status);

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all"
      style={{
        backgroundColor: isSelected
          ? statusColors.bg
          : 'var(--bg-secondary)',
        border: isSelected
          ? `2px solid ${statusColors.border}`
          : '1px solid var(--border-color)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={() => onClick(province.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4
          className="font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {province.name}
        </h4>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium capitalize"
          style={{
            backgroundColor: statusColors.bg,
            color: statusColors.badge,
            border: `1px solid ${statusColors.border}`,
          }}
        >
          {province.status}
        </span>
      </div>

      {/* Water Level */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-xs flex items-center gap-1"
            style={{ color: 'var(--text-muted)' }}
          >
            <Droplets className="w-3 h-3" />
            Water Level
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: statusColors.text }}
          >
            {province.waterLevel}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{
            backgroundColor: isLight
              ? '#e2e8f0'
              : 'rgba(148, 163, 184, 0.2)',
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${province.waterLevel}%`,
              backgroundColor: statusColors.badge,
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Districts
            </span>
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {province.affectedDistricts}
          </p>
        </div>
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: 'var(--bg-tertiary)' }}
        >
          <div className="flex items-center gap-1 mb-1">
            <Users className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Evacuated
            </span>
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatNumber(province.evacuated)}
          </p>
        </div>
      </div>

      {/* Flood Risk */}
      <div
        className="mt-3 flex items-center justify-between p-2 rounded-lg"
        style={{ backgroundColor: statusColors.bg }}
      >
        <span className="text-xs flex items-center gap-1" style={{ color: statusColors.text }}>
          <AlertTriangle className="w-3 h-3" />
          Flood Risk
        </span>
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: statusColors.text }}
        >
          {province.floodRisk}
        </span>
      </div>
    </div>
  );
};

ProvinceStatusCard.propTypes = {
  province: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['critical', 'warning', 'normal']).isRequired,
    waterLevel: PropTypes.number.isRequired,
    floodRisk: PropTypes.string.isRequired,
    affectedDistricts: PropTypes.number.isRequired,
    evacuated: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  isLight: PropTypes.bool,
};

ProvinceStatusCard.defaultProps = {
  isSelected: false,
  isLight: false,
};

export default ProvinceStatusCard;
