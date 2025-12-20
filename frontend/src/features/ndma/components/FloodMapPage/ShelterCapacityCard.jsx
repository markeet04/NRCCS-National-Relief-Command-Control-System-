import PropTypes from 'prop-types';
import { Home, Users } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';

/**
 * ShelterCapacityCard Component
 * Displays shelter capacity and occupancy information
 */
const ShelterCapacityCard = ({ shelters, isLight }) => {
  // Calculate totals
  const totals = shelters.reduce(
    (acc, s) => ({
      total: acc.total + s.total,
      occupied: acc.occupied + s.occupied,
      capacity: acc.capacity + s.capacity,
    }),
    { total: 0, occupied: 0, capacity: 0 }
  );

  const overallOccupancy = Math.round((totals.occupied / totals.total) * 100);

  const getOccupancyColor = (occupied, total) => {
    const percentage = (occupied / total) * 100;
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 70) return '#f97316';
    if (percentage >= 50) return '#eab308';
    return '#22c55e';
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* Header */}
      <div
        className="p-4"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Shelter Capacity
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {totals.total} shelters across {shelters.length} provinces
            </p>
          </div>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          >
            <Home className="w-6 h-6" style={{ color: '#3b82f6' }} />
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Overall Occupancy
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: getOccupancyColor(totals.occupied, totals.total) }}
            >
              {overallOccupancy}%
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{
              backgroundColor: isLight
                ? '#e2e8f0'
                : 'rgba(148, 163, 184, 0.2)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallOccupancy}%`,
                backgroundColor: getOccupancyColor(totals.occupied, totals.total),
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{totals.occupied} occupied</span>
            <span>{totals.total - totals.occupied} available</span>
          </div>
        </div>
      </div>

      {/* Province List */}
      <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
        {shelters.map((shelter) => {
          const occupancy = Math.round((shelter.occupied / shelter.total) * 100);
          const occupancyColor = getOccupancyColor(shelter.occupied, shelter.total);

          return (
            <div key={shelter.province} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {shelter.province}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: occupancyColor }}
                >
                  {occupancy}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="h-2 rounded-full overflow-hidden mb-2"
                style={{
                  backgroundColor: isLight
                    ? '#e2e8f0'
                    : 'rgba(148, 163, 184, 0.2)',
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${occupancy}%`,
                    backgroundColor: occupancyColor,
                  }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <span
                  className="flex items-center gap-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Home className="w-3 h-3" />
                  {shelter.occupied}/{shelter.total} shelters
                </span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Users className="w-3 h-3" />
                  {formatNumber(shelter.capacity)} capacity
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {shelters.length === 0 && (
        <div className="p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            No shelter data available
          </p>
        </div>
      )}
    </div>
  );
};

ShelterCapacityCard.propTypes = {
  shelters: PropTypes.arrayOf(
    PropTypes.shape({
      province: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      occupied: PropTypes.number.isRequired,
      capacity: PropTypes.number.isRequired,
    })
  ).isRequired,
  isLight: PropTypes.bool,
};

ShelterCapacityCard.defaultProps = {
  isLight: false,
};

export default ShelterCapacityCard;
