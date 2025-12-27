import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';

/**
 * AlertsPageHeader Component
 * Page header with title, subtitle, and action buttons
 */
const AlertsPageHeader = ({
  activeAlertsCount,
  showResolved,
  loading,
  onToggleResolved,
  onCreateAlert,
}) => {
  return (
    <div className="alerts-page-header">
      <div>
        <h1 className="alerts-page-title">Nationwide Alerts</h1>
        <p className="alerts-page-subtitle">
          {showResolved
            ? 'Viewing resolved alerts'
            : `Monitoring ${activeAlertsCount} active alerts across Pakistan`}
        </p>
      </div>
      <div className="alerts-page-actions">
        <button
          className={`alerts-btn alerts-btn-secondary ${showResolved ? 'active' : ''}`}
          onClick={onToggleResolved}
          disabled={loading}
        >
          {showResolved ? 'Show Active' : 'Show Resolved'}
        </button>
        <button
          className="alerts-btn alerts-btn-primary"
          onClick={onCreateAlert}
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Create Alert
        </button>
      </div>
    </div>
  );
};

AlertsPageHeader.propTypes = {
  activeAlertsCount: PropTypes.number.isRequired,
  showResolved: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onToggleResolved: PropTypes.func.isRequired,
  onCreateAlert: PropTypes.func.isRequired,
};

AlertsPageHeader.defaultProps = {
  loading: false,
};

export default AlertsPageHeader;
