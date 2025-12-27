import PropTypes from 'prop-types';
import { AlertTriangle, ArrowRight } from 'lucide-react';

/**
 * DashboardAlertBanner Component
 * Displays critical alert banner at the top of the dashboard
 * Uses CSS classes from national-dashboard.css
 */
const DashboardAlertBanner = ({ 
  alertCount, 
  alertMessage,
  onViewAlerts 
}) => {
  if (alertCount === 0) return null;

  return (
    <div className="national-alert-banner">
      <div className="national-alert-banner-content">
        <div className="national-alert-banner-icon">
          <AlertTriangle />
        </div>
        <div className="national-alert-banner-text">
          <div className="national-alert-banner-title">
            {alertCount} Critical Alert{alertCount > 1 ? 's' : ''} Require Attention
          </div>
          <div className="national-alert-banner-desc">
            {alertMessage || 'Flash Flood Warning - Evacuate low-lying areas immediately'}
          </div>
        </div>
      </div>
      <button
        className="national-alert-banner-action"
        onClick={onViewAlerts}
      >
        View all alerts
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

DashboardAlertBanner.propTypes = {
  alertCount: PropTypes.number.isRequired,
  alertMessage: PropTypes.string,
  onViewAlerts: PropTypes.func.isRequired,
};

DashboardAlertBanner.defaultProps = {
  alertMessage: 'Flash Flood Warning - Evacuate low-lying areas immediately',
};

export default DashboardAlertBanner;
