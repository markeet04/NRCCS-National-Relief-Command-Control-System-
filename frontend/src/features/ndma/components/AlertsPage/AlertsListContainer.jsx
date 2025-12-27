import PropTypes from 'prop-types';
import AlertCardItem from './AlertCardItem';

/**
 * AlertsListContainer Component
 * Container for displaying list of alert cards or empty state
 */
const AlertsListContainer = ({
  alerts,
  showResolved,
  onView,
  onResolve,
  onReopen,
  onDelete,
}) => {
  if (alerts.length === 0) {
    return (
      <div className="alerts-list-empty">
        <p>{showResolved ? 'No resolved alerts found' : 'No active alerts at this time'}</p>
      </div>
    );
  }

  return (
    <div className="alerts-list">
      {alerts.map((alert) => (
        <AlertCardItem
          key={alert.id}
          alert={alert}
          onView={onView}
          onResolve={onResolve}
          onReopen={onReopen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

AlertsListContainer.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      severity: PropTypes.string,
      status: PropTypes.string,
      type: PropTypes.string,
      location: PropTypes.string,
      source: PropTypes.string,
    })
  ).isRequired,
  showResolved: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
  onReopen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AlertsListContainer;
