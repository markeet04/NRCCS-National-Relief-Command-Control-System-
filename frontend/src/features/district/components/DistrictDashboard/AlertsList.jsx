/**
 * AlertsList Component
 * Displays today's alerts for district
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import '@styles/css/main.css';

const AlertsList = ({ alerts, title = "Today's Alerts" }) => {
  return (
    <div className="card card-body">
      <h3 className="text-base font-semibold text-primary mb-4">
        {title}
      </h3>

      {alerts.length === 0 ? (
        <p className="text-sm text-muted">
          No alerts at this time
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3">
              <AlertTriangle
                className="flex-shrink-0 mt-0.5"
                style={{
                  color: alert.color,
                  width: '18px',
                  height: '18px'
                }}
              />
              <div>
                <p className="text-sm font-medium text-primary">
                  {alert.type}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AlertsList.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string,
  })).isRequired,
  title: PropTypes.string,
};

export default AlertsList;

