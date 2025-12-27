import PropTypes from 'prop-types';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * DashboardResourceStatus Component
 * Displays the resource status sidebar with progress bars
 * Uses CSS classes from national-dashboard.css
 */
const DashboardResourceStatus = ({ resources }) => {
  /**
   * Get status icon based on resource status
   */
  const getStatusIcon = (status) => {
    if (status === 'adequate') {
      return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />;
    }
    return (
      <AlertTriangle 
        className="w-4 h-4" 
        style={{ color: status === 'low' ? '#f97316' : '#eab308' }} 
      />
    );
  };

  return (
    <div className="national-resource-card border-left-green">
      <div className="national-resource-header">
        <h3 className="national-resource-title">Resource Status</h3>
        <span className="national-resource-timestamp">
          <Clock className="w-3 h-3" />
          Updated just now
        </span>
      </div>
      <div className="national-resource-list">
        {resources.map((resource, index) => (
          <div key={index} className="national-resource-item">
            <div className="national-resource-item-header">
              <div className="national-resource-item-name">
                {getStatusIcon(resource.status)}
                {resource.type}
              </div>
              <div className="national-resource-item-status">
                <span className="national-resource-item-percent">
                  {resource.allocated}%
                </span>
                <span className={`national-resource-item-badge ${resource.status}`}>
                  {resource.status}
                </span>
              </div>
            </div>
            <div className="national-progress">
              <div
                className={`national-progress-bar ${resource.status}`}
                style={{ width: `${resource.allocated}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

DashboardResourceStatus.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      allocated: PropTypes.number.isRequired,
      status: PropTypes.oneOf(['adequate', 'moderate', 'low', 'critical']).isRequired,
    })
  ).isRequired,
};

export default DashboardResourceStatus;
