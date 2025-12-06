/**
 * SOSTable Component
 * Displays SOS requests in a table format
 */

import PropTypes from 'prop-types';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { STATUS_COLORS } from '../constants';

const SOSTable = ({ 
  requests, 
  columns = ['id', 'location', 'time', 'status'],
  showActions = false,
  onView,
  onAssign,
  compact = false 
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ 
            borderBottom: `1px solid ${colors.tableBorder}`, 
            background: colors.tableHeaderBg 
          }}>
            {columns.map((col) => (
              <th 
                key={col}
                className="text-left font-medium"
                style={{ 
                  color: col === 'time' ? '#f59e0b' : colors.textMuted, 
                  fontSize: '13px', 
                  padding: compact ? '12px 16px' : '16px 20px' 
                }}
              >
                {columnLabels[col] || col}
              </th>
            ))}
            {showActions && (
              <th 
                className="text-left font-medium"
                style={{ color: colors.textMuted, fontSize: '13px', padding: compact ? '12px 16px' : '16px 20px' }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {requests.map((sos) => (
            <tr 
              key={sos.id} 
              className="transition-colors duration-200"
              style={{ borderBottom: `1px solid ${colors.tableBorder}` }}
            >
              {columns.map((col) => (
                <td 
                  key={col}
                  style={{ 
                    color: col === 'location' ? colors.primary : colors.textPrimary, 
                    fontSize: '14px', 
                    padding: compact ? '14px 16px' : '20px',
                    fontWeight: col === 'id' ? '500' : '400'
                  }}
                >
                  {col === 'status' ? (
                    <span 
                      className="rounded font-medium"
                      style={{ 
                        backgroundColor: `${getStatusColor(sos.status)}20`,
                        color: getStatusColor(sos.status),
                        fontSize: '12px',
                        padding: '6px 12px',
                        display: 'inline-block',
                        borderRadius: '20px'
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {onView && (
                      <button 
                        onClick={() => onView(sos)}
                        className="rounded font-medium transition-all duration-200"
                        style={{ 
                          background: isLight ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6',
                          fontSize: '13px',
                          padding: '6px 14px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                    )}
                    {onAssign && sos.status === 'Pending' && (
                      <button 
                        onClick={() => onAssign(sos)}
                        className="rounded font-medium transition-all duration-200"
                        style={{ 
                          background: isLight ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          fontSize: '13px',
                          padding: '6px 14px',
                          border: 'none',
                          cursor: 'pointer',
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
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: colors.textMuted 
        }}>
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
