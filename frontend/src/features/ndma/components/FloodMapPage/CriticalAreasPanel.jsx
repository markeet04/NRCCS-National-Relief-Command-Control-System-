import PropTypes from 'prop-types';
import { AlertTriangle, MapPin, Clock, Droplets } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';

/**
 * CriticalAreasPanel Component
 * Displays critical flood monitoring areas
 */
const CriticalAreasPanel = ({ areas, isLight }) => {
  const getStatusColors = (status) => {
    const colors = {
      critical: {
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
        text: '#ef4444',
      },
      warning: {
        bg: 'rgba(249, 115, 22, 0.1)',
        border: 'rgba(249, 115, 22, 0.3)',
        text: '#f97316',
      },
      normal: {
        bg: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.3)',
        text: '#22c55e',
      },
    };
    return colors[status] || colors.normal;
  };

  const criticalCount = areas.filter((a) => a.status === 'critical').length;
  const warningCount = areas.filter((a) => a.status === 'warning').length;

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
        className="p-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Critical Monitoring Areas
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {areas.length} active monitoring points
          </p>
        </div>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
              }}
            >
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                color: '#f97316',
              }}
            >
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Areas List */}
      <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
        {areas.map((area) => {
          const statusColors = getStatusColors(area.status);
          const isOverThreshold = area.waterLevel >= area.threshold;

          return (
            <div
              key={area.id}
              className="p-4"
              style={{
                backgroundColor: area.status === 'critical'
                  ? 'rgba(239, 68, 68, 0.03)'
                  : 'transparent',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {area.status === 'critical' && (
                    <AlertTriangle
                      className="w-4 h-4 animate-pulse"
                      style={{ color: '#ef4444' }}
                    />
                  )}
                  <div>
                    <h4
                      className="font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {area.name}
                    </h4>
                    <p
                      className="text-xs flex items-center gap-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <MapPin className="w-3 h-3" />
                      {area.location}
                    </p>
                  </div>
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${statusColors.border}`,
                  }}
                >
                  {area.status}
                </span>
              </div>

              {/* Water Level Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Droplets className="w-3 h-3" />
                    Water Level
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: isOverThreshold ? '#ef4444' : 'var(--text-secondary)',
                    }}
                  >
                    {area.waterLevel}% / {area.threshold}%
                  </span>
                </div>
                <div className="relative">
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
                        width: `${area.waterLevel}%`,
                        backgroundColor: statusColors.text,
                      }}
                    />
                  </div>
                  {/* Threshold Marker */}
                  <div
                    className="absolute top-0 w-0.5 h-2"
                    style={{
                      left: `${area.threshold}%`,
                      backgroundColor: '#ef4444',
                    }}
                  />
                </div>
              </div>

              {/* Last Updated */}
              <div
                className="flex items-center gap-1 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                <Clock className="w-3 h-3" />
                Updated {area.lastUpdated}
              </div>
            </div>
          );
        })}
      </div>

      {areas.length === 0 && (
        <div className="p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            No critical areas to display
          </p>
        </div>
      )}
    </div>
  );
};

CriticalAreasPanel.propTypes = {
  areas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      status: PropTypes.oneOf(['critical', 'warning', 'normal']).isRequired,
      waterLevel: PropTypes.number.isRequired,
      threshold: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      lastUpdated: PropTypes.string,
    })
  ).isRequired,
  isLight: PropTypes.bool,
};

CriticalAreasPanel.defaultProps = {
  isLight: false,
};

export default CriticalAreasPanel;
