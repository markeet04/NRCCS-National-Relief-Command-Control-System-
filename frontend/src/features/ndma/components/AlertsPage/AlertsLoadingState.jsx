import PropTypes from 'prop-types';
import { DashboardLayout } from '@shared/components/layout';

/**
 * AlertsLoadingState Component
 * Loading state UI for the alerts page
 */
const AlertsLoadingState = ({ menuItems, activeAlertsCount }) => {
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
      <div className="alerts-loading">
        <div className="alerts-loading-spinner"></div>
        <p className="alerts-loading-text">Loading alerts...</p>
      </div>
    </DashboardLayout>
  );
};

AlertsLoadingState.propTypes = {
  menuItems: PropTypes.array.isRequired,
  activeAlertsCount: PropTypes.number,
};

AlertsLoadingState.defaultProps = {
  activeAlertsCount: 0,
};

export default AlertsLoadingState;
