import PropTypes from 'prop-types';
import { DashboardLayout } from '@shared/components/layout';

/**
 * AlertsLoadingState Component
 * Loading state UI for the alerts page
 */
const AlertsLoadingState = ({ menuItems, activeAlertsCount, userName }) => {
  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute="alerts"
      onNavigate={(route) => console.log('Navigate to:', route)}
      userRole="NDMA"
      userName={userName}
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
  userName: PropTypes.string,
};

AlertsLoadingState.defaultProps = {
  activeAlertsCount: 0,
  userName: 'User',
};

export default AlertsLoadingState;

