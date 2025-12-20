import PropTypes from 'prop-types';
import { AlertCard } from '@shared/components/dashboard';

/**
 * AlertList Component
 * Displays a list of alerts with action handlers
 */
const AlertList = ({
  alerts,
  onView,
  onResolve,
  onReopen,
  onDelete,
  emptyMessage,
}) => {
  if (alerts.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-xl"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
        }}
      >
        <p style={{ color: 'var(--text-muted)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {alerts.map((alert) => (
        <div key={alert.id} style={{ margin: '16px 0' }}>
          <AlertCard
            {...alert}
            showSeverityBadge={true}
            onResolve={
              alert.status !== 'resolved' ? () => onResolve(alert.id) : undefined
            }
            onReopen={
              alert.status === 'resolved' ? () => onReopen(alert.id) : undefined
            }
            onDelete={
              alert.status === 'resolved' ? () => onDelete(alert.id) : undefined
            }
            onView={() => onView(alert.id)}
          />
        </div>
      ))}
    </div>
  );
};

AlertList.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      severity: PropTypes.string,
      status: PropTypes.string,
      location: PropTypes.string,
      timestamp: PropTypes.string,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
  onReopen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};

AlertList.defaultProps = {
  emptyMessage: 'No alerts found',
};

export default AlertList;
