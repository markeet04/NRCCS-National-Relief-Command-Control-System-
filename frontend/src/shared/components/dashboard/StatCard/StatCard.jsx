import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber } from '@utils/formatUtils';
import { getSeverityColor, getStatusColor } from '@utils/colorUtils';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

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
 * @param {string} props.gradientKey - Key for gradient colors (rose, emerald, violet, blue, amber, cyan, etc.)
 */
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'default',
  gradientKey
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);
  
  // Get gradient colors for light mode stat cards
  const gradient = isLight && colors.gradients && gradientKey ? colors.gradients[gradientKey] : null;
  
  // Ensure values are valid before processing
  const safeValue = value === null || value === undefined || isNaN(value) ? 0 : value;
  const safeTrend = isNaN(trend) ? 0 : trend;

  const getTrendIcon = () => {
    if (!safeTrend || safeTrend === 0 || isNaN(safeTrend)) return <Minus className="w-4 h-4" />;
    return safeTrend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (gradient) {
      // For bold colored cards, use white with opacity for trends
      return gradient.textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.9)' : (safeTrend > 0 ? '#059669' : safeTrend < 0 ? '#dc2626' : gradient.accent);
    }
    if (!safeTrend || safeTrend === 0 || isNaN(safeTrend)) return 'var(--text-muted)';
    return safeTrend > 0 ? '#059669' : '#dc2626';
  };

  const formattedValue = formatNumber(safeValue);

  return (
    <div
      className="rounded-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
      style={{ 
        background: gradient ? gradient.bg : colors.cardBg,
        border: gradient ? 'none' : `1px solid ${colors.cardBorder}`,
        borderTop: gradient ? `4px solid ${gradient.borderTop}` : `1px solid ${colors.cardBorder}`,
        padding: '24px',
        boxShadow: gradient ? gradient.shadow : colors.cardShadow
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p 
            className="font-semibold mb-2 uppercase tracking-wider" 
            style={{ 
              color: gradient ? gradient.textColor : colors.textMuted, 
              fontSize: '11px',
              opacity: gradient ? 0.9 : 1
            }}
          >
            {title}
          </p>
          <p 
            className="font-bold mb-1" 
            style={{ 
              color: gradient ? gradient.textColor : colors.textPrimary,
              fontSize: '36px',
              lineHeight: '1'
            }}
          >
            {formattedValue}
          </p>
          
          {(safeTrend !== undefined && safeTrend !== 0) || trendLabel ? (
            <div className="flex items-center gap-1 mt-3" style={{ color: getTrendColor() }}>
              {safeTrend !== 0 && getTrendIcon()}
              {safeTrend !== 0 && (
                <span className="text-xs font-semibold">
                  {safeTrend > 0 ? '+' : ''}{Math.abs(safeTrend)}%
                </span>
              )}
              {trendLabel && (
                <span 
                  className="text-xs ml-1" 
                  style={{ color: gradient ? gradient.textColor : colors.textMuted, opacity: gradient ? 0.85 : 0.7 }}
                >
                  {trendLabel}
                </span>
              )}
            </div>
          ) : null}
        </div>

        {Icon && (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: gradient ? gradient.iconBg : colors.iconBg
            }}
          >
            <Icon 
              className="w-6 h-6" 
              style={{ color: '#ffffff' }} 
            />
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
  gradientKey: PropTypes.string,
};

export default StatCard;
