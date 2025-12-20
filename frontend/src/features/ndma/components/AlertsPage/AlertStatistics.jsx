import PropTypes from 'prop-types';
import { formatNumber } from '@utils/formatUtils';

/**
 * AlertStatistics Component
 * Displays alert statistics in a responsive grid
 */
const AlertStatistics = ({ stats, isLight }) => {
  const statCards = [
    {
      key: 'critical',
      label: 'Critical',
      value: stats.critical,
      gradient: {
        light: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        dark: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
      },
      border: {
        light: '1px solid #fecaca',
        dark: '1px solid rgba(239, 68, 68, 0.2)',
      },
      textColor: '#ef4444',
      valueColor: '#dc2626',
    },
    {
      key: 'high',
      label: 'High',
      value: stats.high,
      gradient: {
        light: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        dark: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1))',
      },
      border: {
        light: '1px solid #fed7aa',
        dark: '1px solid rgba(249, 115, 22, 0.2)',
      },
      textColor: '#f97316',
      valueColor: '#ea580c',
    },
    {
      key: 'medium',
      label: 'Medium',
      value: stats.medium,
      gradient: {
        light: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
        dark: 'linear-gradient(to right, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.1))',
      },
      border: {
        light: '1px solid #fde047',
        dark: '1px solid rgba(234, 179, 8, 0.2)',
      },
      textColor: '#eab308',
      valueColor: '#ca8a04',
    },
    {
      key: 'resolvedToday',
      label: 'Resolved Today',
      value: stats.resolvedToday,
      gradient: {
        light: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        dark: 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
      },
      border: {
        light: '1px solid #bbf7d0',
        dark: '1px solid rgba(34, 197, 94, 0.2)',
      },
      textColor: '#22c55e',
      valueColor: '#16a34a',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6" style={{ marginTop: '24px' }}>
      {statCards.map((card) => (
        <div
          key={card.key}
          style={{
            background: isLight ? card.gradient.light : card.gradient.dark,
            borderRadius: '8px',
            padding: '16px',
            border: isLight ? card.border.light : card.border.dark,
          }}
        >
          <div className="text-center">
            <p
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: card.textColor,
                marginBottom: '4px',
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: card.valueColor,
              }}
            >
              {formatNumber(card.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

AlertStatistics.propTypes = {
  stats: PropTypes.shape({
    critical: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    resolvedToday: PropTypes.number.isRequired,
  }).isRequired,
  isLight: PropTypes.bool,
};

AlertStatistics.defaultProps = {
  isLight: false,
};

export default AlertStatistics;
