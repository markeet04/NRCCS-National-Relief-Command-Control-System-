/**
 * SOSTable Component
 * Displays SOS requests in a table format
 * 
 * CSS Migration: Now uses external CSS classes from design system
 */

import PropTypes from 'prop-types';
import { STATUS_COLORS } from '../../constants';
import '@styles/css/main.css';

const SOSTable = ({
  requests,
  columns = ['id', 'location', 'time', 'status'],
  showActions = false,
  onView,
  onAssign,
  compact = false
}) => {
  const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.default;

  const columnLabels = {
    id: 'ID',
    name: 'Name',
    location: 'Location',
    people: 'People',
    time: 'Time',
    status: 'Status',
    phone: 'Phone',
  };

  const cellPadding = compact ? '12px 16px' : '16px 20px';

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  color: col === 'time' ? '#f59e0b' : 'var(--text-muted)',
                  padding: cellPadding
                }}
              >
                {columnLabels[col] || col}
              </th>
            ))}
            {showActions && (
              <th style={{ padding: cellPadding }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {requests.map((sos) => (
            <tr key={sos.id}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    color: col === 'location' ? 'var(--primary)' : 'var(--text-primary)',
                    padding: compact ? '14px 16px' : '20px',
                    fontWeight: col === 'id' ? '500' : '400'
                  }}
                >
                  {col === 'status' ? (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${getStatusColor(sos.status)}20`,
                        color: getStatusColor(sos.status),
                      }}
                    >
                      {sos.status}
                    </span>
                  ) : (
                    sos[col]
                  )}
                </td>
              ))}
              {showActions && (
                <td style={{ padding: compact ? '14px 16px' : '20px' }}>
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(sos)}
                        className="btn btn--sm"
                        style={{
                          background: 'var(--info-light)',
                          color: '#3b82f6',
                        }}
                      >
                        View
                      </button>
                    )}
                    {onAssign && sos.status === 'Pending' && (
                      <button
                        onClick={() => onAssign(sos)}
                        className="btn btn--sm"
                        style={{
                          background: 'var(--success-light)',
                          color: '#10b981',
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <div className="table__empty">
          No SOS requests found
        </div>
      )}
    </div>
  );
};

SOSTable.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    location: PropTypes.string,
    time: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
  showActions: PropTypes.bool,
  onView: PropTypes.func,
  onAssign: PropTypes.func,
  compact: PropTypes.bool,
};

export default SOSTable;

