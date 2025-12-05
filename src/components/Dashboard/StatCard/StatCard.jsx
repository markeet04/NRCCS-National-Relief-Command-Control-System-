import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '../../../utils/formatUtils';
import { getSeverityColor, getStatusColor } from '../../../utils/colorUtils';

/**
 * StatCard Component
 * Displays key metrics with optional trend indicators
 * @param {Object} props - Component props
 * @param {string} props.title - Stat title
 * @param {string|number} props.value - Main stat value
 * @param {string} props.icon - Icon component from lucide-react
 * @param {number} props.trend - Percentage trend (positive/negative)
 * @param {string} props.trendLabel - Label for trend
 * @param {string} props.color - Color theme (default, success, warning, danger)
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'default' 
}) => {
  // Ensure values are valid before processing
  const safeValue = value === null || value === undefined || isNaN(value) ? 0 : value;
  const safeTrend = isNaN(trend) ? 0 : trend;

  const getTrendIcon = () => {
    if (!safeTrend || safeTrend === 0 || isNaN(safeTrend)) return <Minus className="w-4 h-4" />;
    return safeTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!safeTrend || safeTrend === 0 || isNaN(safeTrend)) return 'var(--text-muted)';
    return safeTrend > 0 ? '#10b981' : '#ef4444';
  };

  const formattedValue = formatNumber(safeValue);

  return (
    <div
      className="rounded-xl transition-all duration-200"
      style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
          <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{formattedValue}</p>
          
          {safeTrend !== undefined && safeTrend !== 0 && (
            <div className="flex items-center gap-1 mt-2" style={{ color: getTrendColor() }}>
              {getTrendIcon()}
              <span className="text-xs font-medium">
                {Math.abs(safeTrend)}%
              </span>
              {trendLabel && (
                <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Icon className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  color: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
};

export default StatCard;
