import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@shared/components/layout';

/**
 * AlertsErrorState Component
 * Error state UI for the alerts page
 */
const AlertsErrorState = ({ menuItems, activeAlertsCount, error, onRetry }) => {
  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute="alerts"
      onNavigate={(route) => console.log('Navigate to:', route)}
      userRole="NDMA"
      userName="Admin"
      pageTitle="National Rescue & Crisis Coordination System"
      pageSubtitle="Alert Management System"
      notificationCount={activeAlertsCount}
    >
      <div className="alerts-error">
        <AlertTriangle className="alerts-error-icon" />
        <h3 className="alerts-error-title">Error Loading Alerts</h3>
        <p className="alerts-error-message">{error}</p>
        <button
          className="alerts-btn alerts-btn-primary"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </DashboardLayout>
  );
};

AlertsErrorState.propTypes = {
  menuItems: PropTypes.array.isRequired,
  activeAlertsCount: PropTypes.number,
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

AlertsErrorState.defaultProps = {
  activeAlertsCount: 0,
};

export default AlertsErrorState;
