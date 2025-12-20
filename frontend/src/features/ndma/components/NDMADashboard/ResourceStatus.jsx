import PropTypes from 'prop-types';
import { Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

/**
 * ResourceStatus Component
 * Displays resource allocation status with progress bars
 */
const ResourceStatus = ({ resources, isLight }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'adequate':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-blue-500" />;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'adequate':
        return '#22c55e';
      case 'moderate':
        return '#eab308';
      case 'low':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const getStatusBadgeStyle = (status) => {
    const colors = {
      adequate: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
      moderate: { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
      low: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316' },
      critical: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    };
    return colors[status] || colors.adequate;
  };

  return (
    <div 
      className="rounded-xl p-5"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        border: '1px solid var(--border-color)' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Resource Status
        </h3>
        <span 
          className="text-xs flex items-center gap-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <Clock className="w-3 h-3" />
          Updated just now
        </span>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => {
          const statusStyle = getStatusBadgeStyle(resource.status);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(resource.status)}
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {resource.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {resource.allocated}%
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                    style={{ 
                      backgroundColor: statusStyle.bg, 
                      color: statusStyle.text 
                    }}
                  >
                    {resource.status}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${resource.allocated}%`,
                    backgroundColor: getProgressColor(resource.status),
                  }}
                />
              </div>
              
              {resource.lastUpdated && (
                <p 
                  className="text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Last updated: {resource.lastUpdated}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ResourceStatus.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      allocated: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['adequate', 'moderate', 'low', 'critical']).isRequired,
      unit: PropTypes.string,
      lastUpdated: PropTypes.string,
    })
  ).isRequired,
  isLight: PropTypes.bool,
};

ResourceStatus.defaultProps = {
  isLight: false,
};

export default ResourceStatus;
